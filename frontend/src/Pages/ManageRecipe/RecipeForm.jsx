import React, { useState, useEffect } from "react";
import styles from "./RecipeForm.module.scss";
import {
  Input,
  Button,
  Form,
  Typography,
  Upload,
  message,
  AutoComplete,
  InputNumber,
  Space,
  Divider,
  Skeleton,
  Avatar,
  Carousel,
  Select,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  PictureOutlined,
  MinusCircleOutlined,
  BookOutlined,
  PrinterOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { recipeService } from "../../services/recipeService";
import { categoryService } from "../../services/categoryService";
import { ingredientService } from "../../services/ingredientService";
import useAuth from "../../utils/auth";

// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const { Title } = Typography;
const { TextArea } = Input;

// Predefined ingredient types for the dropdown
const INGREDIENT_TYPES = [
  { label: "Vegetable", value: "Vegetable" },
  { label: "Meat", value: "Meat" },
  { label: "Spice", value: "Spice" },
  { label: "Grain", value: "Grain" },
  { label: "Dairy", value: "Dairy" },
  { label: "Other", value: "Other" },
];

const RecipeForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useAuth();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  const [fileList, setFileList] = useState({ images: [], videos: [] });
  const [instructions, setInstructions] = useState([]);
  const [ingredients, setIngredients] = useState([]); // Stores { ingredient_id, ingredient_name, ingredient_type, amount, unit }
  const [categoryOptions, setCategoryOptions] = useState([]); // Stores { label, value, id }
  const [ingredientOptions, setIngredientOptions] = useState([]); // Stores { value, label, id } for AutoComplete
  const [currentIngredientIndex, setCurrentIngredientIndex] = useState(null);
  const [fetchedCategories, setFetchedCategories] = useState([]); // Stores { category_name, category_id }
  const [fetchedIngredients, setFetchedIngredients] = useState([]); // Stores { ingredient_name, ingredient_id }
  const [selectedCategories, setSelectedCategories] = useState([]); // Stores { category_name, category_id }

  useEffect(() => {
    if (isEditMode) {
      // Fetch recipe data for editing
      setLoading(true);
      const fetchRecipe = async () => {
        try {
          const response = await recipeService.getRecipeById(id);
          const recipeData = response.data;
          form.setFieldsValue({
            recipe_name: recipeData.recipe_name,
            description: recipeData.description,
            recipe_type: recipeData.recipe_type,
            servings: recipeData.servings,
            prep_time: recipeData.prep_time,
            cook_time: recipeData.cook_time,
            categories: recipeData.categories.map(cat => cat.category_name),
          });

          // Set local state for instructions and ingredients
          setInstructions(recipeData.instructions.map(instruction => ({
            step_number: instruction.step_number,
            description: instruction.description,
          })));
          setIngredients(recipeData.ingredients.map(ingredient => ({
            ingredient_id: ingredient.ingredient_id,
            ingredient_name: ingredient.ingredient_name,
            ingredient_type: ingredient.ingredient_type || "Other", // Default to "Other" if not provided
            amount: ingredient.amount,
            unit: ingredient.unit,
          })));

          // Populate selected categories with IDs
          const initialCategories = recipeData.categories.map(cat => ({
            category_name: cat.category_name,
            category_id: cat.category_id,
          }));
          setSelectedCategories(initialCategories);
          setFetchedCategories(initialCategories); // Add initial categories to fetchedCategories
          setCategoryOptions(initialCategories.map(cat => ({
            label: cat.category_name,
            value: cat.category_name,
            id: cat.category_id,
          })));

          // Set fileList for images and videos
          setFileList({
            images: recipeData.images.map((url, index) => ({
              uid: `image-${index}`,
              name: `image-${index}.jpg`,
              status: 'done',
              url,
            })),
            videos: recipeData.videos.map((url, index) => ({
              uid: `video-${index}`,
              name: `video-${index}.mp4`,
              status: 'done',
              url,
            })),
          });
        } catch (err) {
          message.error(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchRecipe();
    }
  }, [form, isEditMode, id]);

  // Debounced function to fetch categories using categoryService
  const fetchCategories = debounce(async (value) => {
    if (!value || value.trim() === "") {
      setCategoryOptions(fetchedCategories.map(cat => ({
        label: cat.category_name,
        value: cat.category_name,
        id: cat.category_id,
      })));
      return;
    }

    try {
      const response = await categoryService.getCategoriesByName(value);
      const categories = response.data.map(item => ({
        category_name: item.category_name,
        category_id: item.category_id,
      }));

      // Merge fetched categories with existing ones, avoiding duplicates
      const updatedFetchedCategories = Array.from(
        new Map([...fetchedCategories, ...categories].map(cat => [cat.category_id, cat])).values()
      );
      setFetchedCategories(updatedFetchedCategories);
      setCategoryOptions(updatedFetchedCategories.map(cat => ({
        label: cat.category_name,
        value: cat.category_name,
        id: cat.category_id,
      })));
    } catch (err) {
      message.error(err.message);
      setCategoryOptions(fetchedCategories.map(cat => ({
        label: cat.category_name,
        value: cat.category_name,
        id: cat.category_id,
      })));
    }
  }, 300);

  // Function to create a new category if it doesn't exist
  const createOrSelectCategory = async (categoryName) => {
    if (!categoryName || categoryName.trim() === "") {
      return null;
    }

    // Check if the category already exists in fetchedCategories
    const existingCategory = fetchedCategories.find(cat => cat.category_name.toLowerCase() === categoryName.toLowerCase());
    if (existingCategory) {
      return {
        category_name: existingCategory.category_name,
        category_id: existingCategory.category_id,
      };
    }

    // If not exists, create a new category
    try {
      const response = await categoryService.createCategory({ category_name: categoryName });
      const newCategory = {
        category_name: categoryName,
        category_id: response.data.category_id, // Assuming the response includes the new category_id
      };
      // Update fetchedCategories and categoryOptions
      setFetchedCategories(prev => {
        const updated = [...prev, newCategory];
        return Array.from(
          new Map(updated.map(cat => [cat.category_id, cat])).values()
        );
      });
      setCategoryOptions(prev => {
        const updated = [...prev, {
          label: categoryName,
          value: categoryName,
          id: newCategory.category_id,
        }];
        return Array.from(
          new Map(updated.map(opt => [opt.value, opt])).values()
        );
      });
      message.success(`Category "${categoryName}" created successfully.`);
      return newCategory;
    } catch (err) {
      message.error(`Failed to create category "${categoryName}": ${err.message}`);
      return null;
    }
  };

  // Handle category selection and creation
  const handleCategoryChange = async (value) => {
    const newSelectedCategories = [];
    const currentSelectedNames = selectedCategories.map(cat => cat.category_name.toLowerCase());

    // Process each category in the current value
    for (const category of value) {
      // Skip if the category is already in selectedCategories
      const existingCategory = selectedCategories.find(cat => cat.category_name.toLowerCase() === category.toLowerCase());
      if (existingCategory) {
        newSelectedCategories.push(existingCategory);
        continue;
      }

      // If the category is new, create or select it
      const selectedCategory = await createOrSelectCategory(category);
      if (selectedCategory) {
        newSelectedCategories.push(selectedCategory);
      }
    }

    // Remove categories that are no longer in the value
    const finalSelectedCategories = newSelectedCategories.filter(cat => 
      value.some(val => val.toLowerCase() === cat.category_name.toLowerCase())
    );

    setSelectedCategories(finalSelectedCategories);
    form.setFieldsValue({ categories: value });
  };

  // Handle blur event to create category if the last entered tag isn't selected
  const handleCategoryBlur = async () => {
    const currentValue = form.getFieldValue("categories") || [];
    if (currentValue.length === 0) {
      setSelectedCategories([]);
      return;
    }

    const newSelectedCategories = [];
    const currentSelectedNames = selectedCategories.map(cat => cat.category_name.toLowerCase());

    // Process each category in the current value
    for (const category of currentValue) {
      // Skip if the category is already in selectedCategories
      const existingCategory = selectedCategories.find(cat => cat.category_name.toLowerCase() === category.toLowerCase());
      if (existingCategory) {
        newSelectedCategories.push(existingCategory);
        continue;
      }

      // If the category is new, create or select it
      const selectedCategory = await createOrSelectCategory(category);
      if (selectedCategory) {
        newSelectedCategories.push(selectedCategory);
      }
    }

    // Remove categories that are no longer in the value
    const finalSelectedCategories = newSelectedCategories.filter(cat => 
      currentValue.some(val => val.toLowerCase() === cat.category_name.toLowerCase())
    );

    setSelectedCategories(finalSelectedCategories);
    form.setFieldsValue({ categories: currentValue });
  };

  // Debounced function to fetch ingredients using ingredientService
  const fetchIngredients = debounce(async (value, index) => {
    if (!value || value.trim() === "") {
      setIngredientOptions([]);
      setFetchedIngredients([]);
      return;
    }

    try {
      const response = await ingredientService.getIngredientByName(value);

      const ingredients = response.data.map(item => ({
        ingredient_name: item.ingredient_name,
        ingredient_id: item.ingredient_id,
      }));

      // Remove duplicates by ingredient_name (case-insensitive)
      const uniqueIngredients = Array.from(
        new Map(ingredients.map(ing => [ing.ingredient_name.toLowerCase(), ing])).values()
      );

      const newOptions = uniqueIngredients.map(ing => ({
        value: ing.ingredient_name,
        label: ing.ingredient_name,
        id: ing.ingredient_id,
      }));

      setIngredientOptions(newOptions);
      setFetchedIngredients(uniqueIngredients);
    } catch (err) {
      message.error(err.message);
      setIngredientOptions([]);
      setFetchedIngredients([]);
    }
  }, 300);

  // Add a new instruction
  const addInstruction = () => {
    const newInstruction = { step_number: instructions.length + 1, description: "" };
    const newInstructions = [...instructions, newInstruction];
    setInstructions(newInstructions);
    form.setFieldsValue({ instructions: newInstructions });
  };

  // Remove an instruction
  const removeInstruction = (index) => {
    const newInstructions = instructions.filter((_, i) => i !== index);
    setInstructions(newInstructions);
    form.setFieldsValue({ instructions: newInstructions });
  };

  // Update an instruction field
  const updateInstruction = (index, field, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = { ...newInstructions[index], [field]: value };
    setInstructions(newInstructions);
    form.setFieldsValue({ instructions: newInstructions });
  };

  // Add a new ingredient
  const addIngredient = () => {
    const newIngredient = { 
      ingredient_id: null, 
      ingredient_name: "", 
      ingredient_type: "Other", // Default type
      amount: null, 
      unit: "" 
    };
    const newIngredients = [...ingredients, newIngredient];
    setIngredients(newIngredients);
    form.setFieldsValue({ ingredients: newIngredients });
  };

  // Remove an ingredient
  const removeIngredient = async (index) => {
    const ingredient = ingredients[index];
    try {
      // If the ingredient has an ingredient_id, delete it from the server
      if (ingredient.ingredient_id) {
        await ingredientService.deleteIngredient(ingredient.ingredient_id);
        message.success(`Ingredient "${ingredient.ingredient_name}" deleted successfully.`);

        // Remove the ingredient from fetchedIngredients and ingredientOptions
        setFetchedIngredients(prev => prev.filter(ing => ing.ingredient_id !== ingredient.ingredient_id));
        setIngredientOptions(prev => prev.filter(opt => opt.id !== ingredient.ingredient_id));
      }

      // Remove the ingredient from the local state
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
      form.setFieldsValue({ ingredients: newIngredients });
    } catch (err) {
      message.error(err.message);
    }
  };

  // Update an ingredient field
  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
    // Update the form field for amount and unit, but not for ingredient_name or ingredient_type
    if (field !== "ingredient_name" && field !== "ingredient_type") {
      form.setFieldsValue({ ingredients: newIngredients });
    }
  };

  // Handle ingredient creation when the confirm button is clicked
  const handleIngredientCreation = async (index, value) => {
    if (!value || value.trim() === "") {
      message.error("Please enter an ingredient name.");
      return;
    }

    const ingredient = ingredients[index];
    const { ingredient_type, amount, unit } = ingredient;

    // Validate required fields
    if (!ingredient_type) {
      message.error("Please select an ingredient type.");
      return;
    }
    if (amount === null || amount === undefined) {
      message.error("Please enter an amount for the ingredient.");
      return;
    }
    if (!unit || unit.trim() === "") {
      message.error("Please enter a unit for the ingredient.");
      return;
    }

    try {
      // Always create a new ingredient, regardless of whether it exists
      const response = await ingredientService.createIngredient({
        ingredient_name: value,
        ingredient_type,
        amount,
        unit,
      });
      const newIngredient = {
        ingredient_name: value,
        ingredient_id: response.data.ingredient_id, // Assuming the response includes the new ingredient_id
      };
      // Update fetchedIngredients and ingredientOptions for autocomplete
      setFetchedIngredients(prev => {
        const updated = [...prev, newIngredient];
        return Array.from(
          new Map(updated.map(ing => [ing.ingredient_name.toLowerCase(), ing])).values()
        );
      });
      setIngredientOptions(prev => {
        const updated = [...prev, { value: value, label: value, id: newIngredient.ingredient_id }];
        return Array.from(
          new Map(updated.map(opt => [opt.value, opt])).values()
        );
      });
      // Update the ingredient state with the new ingredient's ID and name in a single state update
      setIngredients(prevIngredients => {
        const newIngredients = [...prevIngredients];
        newIngredients[index] = {
          ...newIngredients[index],
          ingredient_id: newIngredient.ingredient_id,
          ingredient_name: value,
        };
        return newIngredients;
      });
      message.success(`Ingredient "${value}" created successfully.`);
    } catch (err) {
      message.error(`Failed to create ingredient "${value}": ${err.message}`);
    }
  };

  const handleFileChange = (type) => ({ fileList: newFileList }) => {
    // Define limits
    const imageLimit = 5;
    const videoLimit = 1;

    // Check limits based on type
    if (type === 'images' && newFileList.length > imageLimit) {
      message.error(`You can only upload up to ${imageLimit} images.`);
      return; // Prevent updating the fileList
    }
    if (type === 'videos' && newFileList.length > videoLimit) {
      message.error(`You can only upload up to ${videoLimit} video.`);
      return; // Prevent updating the fileList
    }

    // Update the fileList if within limits
    setFileList(prev => ({ ...prev, [type]: newFileList }));
  };

  const handleSubmit = async (values) => {
    if (!isAuthenticated || !userId) {
      message.error("Please log in to submit a recipe");
      return;
    }

    try {
      // Validate ingredients only if there are any
      if (ingredients.length > 0) {
        for (let i = 0; i < ingredients.length; i++) {
          const ingredient = ingredients[i];
          if (!ingredient.ingredient_name || ingredient.ingredient_name.trim() === "") {
            message.error(`Please enter a name for ingredient ${i + 1}`);
            return;
          }
          if (!ingredient.ingredient_type) {
            message.error(`Please select a type for ingredient ${i + 1}`);
            return;
          }
          if (ingredient.amount === null || ingredient.amount === undefined) {
            message.error(`Please enter an amount for ingredient ${i + 1}`);
            return;
          }
          if (!ingredient.unit || ingredient.unit.trim() === "") {
            message.error(`Please enter a unit for ingredient ${i + 1}`);
            return;
          }
          if (!ingredient.ingredient_id) {
            message.error(`Please create or select ingredient ${i + 1} by clicking the checkmark button`);
            return;
          }
        }
      }

      // Process ingredients: Filter out invalid entries and include only ingredient_id
      const processedIngredients = ingredients
        .filter(ingredient => ingredient.ingredient_id && ingredient.ingredient_name && ingredient.ingredient_name.trim() !== "")
        .map(ingredient => ({
          ingredient_id: ingredient.ingredient_id,
        }));

      // Process categories: Format with only category_id
      const processedCategories = selectedCategories
        .filter(cat => cat.category_id && cat.category_name && cat.category_name.trim() !== "")
        .map(cat => ({
          category_id: cat.category_id,
        }));

      // Process instructions: Filter out invalid entries
      const processedInstructions = instructions
        .filter(instruction => instruction.step_number && instruction.description)
        .map(instruction => ({
          step_number: instruction.step_number,
          description: instruction.description,
        }));

      // Process images: Include existing image URLs (not being replaced) in recipeData
      const existingImages = fileList.images
        .filter(file => !file.originFileObj) // Only include images that are not new uploads (i.e., already have URLs)
        .map(file => file.url);

      // Process videos: Include existing video URLs (not being replaced) in recipeData
      const existingVideos = fileList.videos
        .filter(file => !file.originFileObj) // Only include videos that are not new uploads (i.e., already have URLs)
        .map(file => file.url);

      // Prepare the recipe data for the API
      const recipeData = {
        recipe_name: values.recipe_name,
        description: values.description,
        recipe_type: values.recipe_type,
        servings: values.servings || 1,
        prep_time: values.prep_time || 0,
        cook_time: values.cook_time || 0,
        images: existingImages, // Include existing image URLs
        videos: existingVideos, // Include existing video URLs
        ingredients: processedIngredients,
        instructions: processedInstructions,
        categories: processedCategories,
        user_id: userId,
      };

      // Prepare files for upload (new images and videos)
      const files = {
        images: fileList.images
          .filter(file => file.originFileObj) // Only include new uploads
          .map(file => file.originFileObj),
        videos: fileList.videos
          .filter(file => file.originFileObj) // Only include new uploads
          .map(file => file.originFileObj),
      };

      if (isEditMode) {
        await recipeService.updateRecipe(id, recipeData, files);
        message.success("Recipe updated successfully");
      } else {
        await recipeService.createRecipe(recipeData, files);
        message.success("Recipe created successfully");
      }
      navigate("/profile");
    } catch (err) {
      message.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.skeletonContainer}>
        <div className={styles.section}>
          <Skeleton active title={{ width: '50%' }} paragraph={false} />
        </div>
        <div className={styles.section}>
          <Skeleton active avatar paragraph={{ rows: 1, width: ['20%'] }} />
        </div>
        <div className={styles.section}>
          <Skeleton active paragraph={{ rows: 2, width: ['80%', '60%'] }} />
        </div>
        <div className={styles.section}>
          <Skeleton active paragraph={{ rows: 0 }} className={styles.skeletonActions} />
        </div>
        <Divider className={styles.divider} />
        <div className={styles.section}>
          <Skeleton.Image active className={styles.skeletonImage} />
          <Skeleton active paragraph={{ rows: 0 }} className={styles.skeletonUpload} />
        </div>
        <Divider className={styles.divider} />
        <div className={styles.section}>
          <div className={styles.skeletonInfoSection}>
            <Skeleton active paragraph={{ rows: 1, width: ['30%'] }} />
            <Skeleton active paragraph={{ rows: 1, width: ['20%'] }} />
            <Skeleton active paragraph={{ rows: 1, width: ['20%'] }} />
          </div>
        </div>
        <Divider className={styles.divider} />
        <div className={styles.section}>
          <div className={styles.skeletonRecipeDetails}>
            <div className={styles.skeletonDirections}>
              <Skeleton active title={{ width: '30%' }} paragraph={{ rows: 5, width: ['90%', '80%', '70%', '60%', '50%'] }} />
            </div>
            <div className={styles.skeletonIngredients}>
              <Skeleton active title={{ width: '30%' }} paragraph={{ rows: 3, width: ['60%', '50%', '40%'] }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Form form={form} onFinish={handleSubmit}>
        <div className={styles.section}>
          <Title className={styles.title}>
            <Form.Item
              name="recipe_name"
              rules={[{ required: true, message: "Please enter recipe name" }]}
              noStyle
            >
              <Input
                placeholder="Recipe Name (e.g., Spaghetti Bolognese)"
                className={styles.titleInput}
              />
            </Form.Item>
          </Title>
        </div>

        <div className={styles.section}>
          <div className={styles.submitted}>
            <Avatar
              size={32}
              src={isAuthenticated ? "https://randomuser.me/api/portraits/women/1.jpg" : undefined}
            />
            <span className={styles.submittedText}>{isAuthenticated ? "You" : "Guest"}</span>
            <span className={styles.dots}>...</span>
          </div>
        </div>

        <div className={styles.section}>
          <Form.Item
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea
              rows={3}
              placeholder="Describe your recipe..."
              className={styles.descriptionInput}
            />
          </Form.Item>
        </div>

        <div className={styles.section}>
          <Form.Item
            name="recipe_type"
            rules={[{ required: true, message: "Please enter recipe type" }]}
          >
            <Input
              placeholder="Recipe Type (e.g., Italian)"
              className={styles.recipeTypeInput}
            />
          </Form.Item>
        </div>

        <div className={styles.section}>
          <Form.Item name="categories">
            <Select
              mode="tags"
              placeholder="Select or type categories"
              className={styles.categorySelect}
              onSearch={fetchCategories}
              onChange={handleCategoryChange}
              onBlur={handleCategoryBlur}
              filterOption={false}
              options={categoryOptions}
            />
          </Form.Item>
        </div>

        <div className={styles.section}>
          <Space className={styles.actions}>
            <Button icon={<BookOutlined />} disabled />
            <Button icon={<UploadOutlined />} disabled />
            <Button icon={<PrinterOutlined />} disabled />
            <Button type="primary" htmlType="submit" className={styles.submitButton}>
              {isEditMode ? "UPDATE RECIPE" : "SUBMIT RECIPE"}
            </Button>
          </Space>
        </div>

        <Divider className={styles.divider} />

        <div className={styles.section}>
          <div className={styles.imageSection}>
            <div className={styles.mainImageContainer}>
              {fileList.images && fileList.images.length > 0 ? (
                <Carousel className={styles.carousel}>
                  {fileList.images.map((file, index) => (
                    <div key={index}>
                      <img
                        src={file.url || URL.createObjectURL(file.originFileObj)}
                        alt={`Preview ${index + 1}`}
                        className={styles.mainImage}
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <div className={styles.imagePlaceholder}>
                  <PictureOutlined style={{ fontSize: '50px', color: '#999' }} />
                  <p>No images uploaded</p>
                </div>
              )}
            </div>
            {/* Use maxCount to limit the number of images to 5 */}
            <Upload
              listType="picture-card"
              fileList={fileList.images}
              onChange={handleFileChange('images')}
              beforeUpload={() => false}
              multiple
              maxCount={5} // Limit to 5 images
              className={styles.upload}
            >
              {fileList.images.length < 5 && (
                <div>
                  <PictureOutlined />
                  <div>Add Images</div>
                </div>
              )}
            </Upload>
            {/* Use maxCount to limit the number of videos to 1 */}
            <Upload
              fileList={fileList.videos}
              onChange={handleFileChange('videos')}
              beforeUpload={() => false}
              multiple={false} // Prevent multiple selection
              maxCount={1} // Limit to 1 video
              accept="video/mp4"
              className={styles.uploadVideos}
            >
              {fileList.videos.length < 1 && (
                <Button icon={<UploadOutlined />}>Select Video</Button>
              )}
            </Upload>
            {fileList.videos && fileList.videos.length > 0 && (
              <div className={styles.videoContainer}>
                {fileList.videos.map((file, index) => (
                  <video key={index} controls className={styles.video}>
                    <source src={file.url || URL.createObjectURL(file.originFileObj)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ))}
              </div>
            )}
          </div>
        </div>

        <Divider className={styles.divider} />

        <div className={styles.section}>
          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                🕒 Ready in: 
                <Form.Item name="cook_time" noStyle>
                  <InputNumber min={0} className={styles.infoInput} />
                </Form.Item>
                mins
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                🍽️ Serves: 
                <Form.Item name="servings" noStyle>
                  <InputNumber min={1} className={styles.infoInput} />
                </Form.Item>
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                🥄 Ingredients: 
                {ingredients.length}
              </span>
            </div>
          </div>
        </div>

        <Divider className={styles.divider} />

        <div className={styles.section}>
          <div className={styles.recipeDetails}>
            <div className={styles.directions}>
              <h2 className={styles.sectionTitle}>DIRECTIONS</h2>
              <ol className={styles.directionList}>
                {instructions.map((instruction, index) => (
                  <li key={index} className={styles.directionItem}>
                    <Space align="center">
                      <Form.Item
                        name={["instructions", index, "step_number"]}
                        initialValue={instruction.step_number}
                        rules={[{ required: true, message: "Step number is required" }]}
                      >
                        <InputNumber
                          min={1}
                          placeholder="Step #"
                          className={styles.stepInput}
                          value={instruction.step_number}
                          onChange={(value) => updateInstruction(index, "step_number", value)}
                        />
                      </Form.Item>
                      <Form.Item
                        name={["instructions", index, "description"]}
                        initialValue={instruction.description}
                        rules={[{ required: true, message: "Instruction is required" }]}
                      >
                        <Input
                          placeholder="Instruction"
                          className={styles.instructionInput}
                          value={instruction.description}
                          onChange={(e) => updateInstruction(index, "description", e.target.value)}
                        />
                      </Form.Item>
                      <Button
                        icon={<MinusCircleOutlined />}
                        onClick={() => removeInstruction(index)}
                        className={styles.removeButton}
                      />
                    </Space>
                  </li>
                ))}
              </ol>
              <Button
                type="dashed"
                onClick={addInstruction}
                icon={<PlusOutlined />}
                className={styles.addButton}
              >
                Add Instruction
              </Button>
            </div>
            <div className={styles.ingredients}>
              <h2 className={styles.sectionTitle}>INGREDIENTS</h2>
              <ul className={styles.ingredientList}>
                {ingredients.map((ingredient, index) => (
                  <li key={index} className={styles.ingredientItem}>
                    <Space align="center">
                      <AutoComplete
                        className={styles.ingredientNameInput}
                        onSearch={(value) => fetchIngredients(value, index)}
                        onFocus={() => {
                          setCurrentIngredientIndex(index);
                          fetchIngredients("", index);
                        }}
                        onChange={(value) => updateIngredient(index, "ingredient_name", value)}
                        onSelect={(value, option) => {
                          const selectedIngredient = fetchedIngredients.find(ing => ing.ingredient_name === value);
                          if (selectedIngredient) {
                            updateIngredient(index, "ingredient_id", selectedIngredient.ingredient_id);
                            updateIngredient(index, "ingredient_name", value);
                          }
                        }}
                        options={ingredientOptions.map(option => ({
                          value: option.value,
                          label: option.label,
                        }))}
                        value={ingredient.ingredient_name}
                        placeholder="Ingredient name"
                        allowClear
                        filterOption={(inputValue, option) =>
                          option.value.toLowerCase().includes(inputValue.toLowerCase())
                        }
                      />
                      <Select
                        className={styles.ingredientTypeInput}
                        value={ingredient.ingredient_type}
                        onChange={(value) => updateIngredient(index, "ingredient_type", value)}
                        placeholder="Type"
                        options={INGREDIENT_TYPES}
                      />
                      <Form.Item
                        name={["ingredients", index, "amount"]}
                        initialValue={ingredient.amount}
                      >
                        <InputNumber
                          min={0}
                          placeholder="Amount"
                          className={styles.amountInput}
                          value={ingredient.amount}
                          onChange={(value) => updateIngredient(index, "amount", value)}
                        />
                      </Form.Item>
                      <Form.Item
                        name={["ingredients", index, "unit"]}
                        initialValue={ingredient.unit}
                      >
                        <Input
                          placeholder="Unit"
                          className={styles.unitInput}
                          value={ingredient.unit}
                          onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                        />
                      </Form.Item>
                      <Button
                        icon={<CheckOutlined />}
                        onClick={() => handleIngredientCreation(index, ingredient.ingredient_name)}
                        style={{ color: '#52c41a' }}
                      />
                      <Button
                        icon={<MinusCircleOutlined />}
                        onClick={() => removeIngredient(index)}
                        className={styles.removeButton}
                      />
                    </Space>
                  </li>
                ))}
              </ul>
              <Button
                type="dashed"
                onClick={addIngredient}
                icon={<PlusOutlined />}
                className={styles.addButton}
              >
                Add Ingredient
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default RecipeForm;