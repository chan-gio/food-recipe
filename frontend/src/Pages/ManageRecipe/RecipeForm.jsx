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

const RecipeForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useAuth();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  const [fileList, setFileList] = useState({ images: [], videos: [] });
  const [instructions, setInstructions] = useState([]);
  const [ingredients, setIngredients] = useState([]); // Stores { ingredient_id, ingredient_name, amount, unit }
  const [categoryOptions, setCategoryOptions] = useState([]); // Stores { label, value, id }
  const [ingredientOptions, setIngredientOptions] = useState([]); // Stores { value, id } for AutoComplete
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
            images: [],
            videos: [],
          });

          // Set local state for instructions and ingredients
          setInstructions(recipeData.instructions.map(instruction => ({
            step_number: instruction.step_number,
            description: instruction.description,
          })));
          setIngredients(recipeData.ingredients.map(ingredient => ({
            ingredient_id: ingredient.ingredient_id,
            ingredient_name: ingredient.ingredient_name,
            amount: ingredient.amount,
            unit: ingredient.unit,
          })));

          // Populate selected categories with IDs
          setSelectedCategories(recipeData.categories.map(cat => ({
            category_name: cat.category_name,
            category_id: cat.category_id,
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
      setCategoryOptions([]);
      setFetchedCategories([]);
      return;
    }

    try {
      const response = await categoryService.getCategoriesByName(value);
      const categories = response.data.map(item => ({
        category_name: item.category_name,
        category_id: item.category_id,
      }));
      setCategoryOptions(categories.map(cat => ({
        label: cat.category_name,
        value: cat.category_name,
        id: cat.category_id,
      })));
      setFetchedCategories(categories);
    } catch (err) {
      message.error(err.message);
      setCategoryOptions([]);
      setFetchedCategories([]);
    }
  }, 300);

  // Debounced function to fetch ingredients using ingredientService
  const fetchIngredients = debounce(async (value, index) => {
    if (!value || value.trim() === "") {
      setIngredientOptions([]);
      setFetchedIngredients([]);
      return;
    }

    try {
      const response = await ingredientService.getIngredientByName(value);
      console.log("Search API response for value", value, ":", response.data);

      const ingredients = response.data.map(item => ({
        ingredient_name: item.ingredient_name,
        ingredient_id: item.ingredient_id,
      }));

      // Remove duplicates by ingredient_id (most unique identifier)
      const uniqueIngredients = Array.from(
        new Map(ingredients.map(ing => [ing.ingredient_id, ing])).values()
      );

      const newOptions = uniqueIngredients.map(ing => ({
        value: ing.ingredient_name,
        label: ing.ingredient_name, // Add label for display
        id: ing.ingredient_id,
      }));

      setIngredientOptions(newOptions);
      setFetchedIngredients(uniqueIngredients);
      console.log(`Updated ingredientOptions for index ${index}:`, newOptions);
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
    console.log("Added new instruction. Instructions:", newInstructions);
  };

  // Remove an instruction
  const removeInstruction = (index) => {
    const newInstructions = instructions.filter((_, i) => i !== index);
    setInstructions(newInstructions);
    form.setFieldsValue({ instructions: newInstructions });
    console.log("Removed instruction. Instructions:", newInstructions);
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
    const newIngredient = { ingredient_id: null, ingredient_name: "", amount: null, unit: "" };
    const newIngredients = [...ingredients, newIngredient];
    setIngredients(newIngredients);
    form.setFieldsValue({ ingredients: newIngredients });
    console.log("Added new ingredient. Ingredients:", newIngredients);
  };

  // Remove an ingredient
  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    form.setFieldsValue({ ingredients: newIngredients });
    console.log("Removed ingredient. Ingredients:", newIngredients);
  };

  // Update an ingredient field
  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
    form.setFieldsValue({ ingredients: newIngredients });
  };

  // Handle ingredient creation when the confirm button is clicked
  const handleIngredientCreation = async (index, value) => {
    if (!value || value.trim() === "") {
      message.error("Please enter an ingredient name.");
      return;
    }

    const existingIngredient = fetchedIngredients.find(ing => ing.ingredient_name.toLowerCase() === value.toLowerCase());
    if (existingIngredient) {
      updateIngredient(index, "ingredient_id", existingIngredient.ingredient_id);
      updateIngredient(index, "ingredient_name", existingIngredient.ingredient_name);
      message.success(`Ingredient "${existingIngredient.ingredient_name}" selected.`);
    } else {
      try {
        const response = await ingredientService.createIngredient({ ingredient_name: value });
        const newIngredient = {
          ingredient_name: value,
          ingredient_id: response.data.ingredient_id, // Assuming the response includes the new ingredient_id
        };
        setFetchedIngredients(prev => {
          const updated = [...prev, newIngredient];
          return Array.from(
            new Map(updated.map(ing => [ing.ingredient_id, ing])).values()
          );
        });
        setIngredientOptions(prev => {
          const updated = [...prev, { value: value, label: value, id: newIngredient.ingredient_id }];
          return Array.from(
            new Map(updated.map(opt => [opt.id, opt])).values()
          );
        });
        updateIngredient(index, "ingredient_id", newIngredient.ingredient_id);
        updateIngredient(index, "ingredient_name", value);
        message.success(`Ingredient "${value}" created successfully.`);
      } catch (err) {
        message.error(`Failed to create ingredient "${value}": ${err.message}`);
      }
    }
  };

  const handleFileChange = (type) => ({ fileList: newFileList }) => {
    setFileList(prev => ({ ...prev, [type]: newFileList }));
  };

  const handleSubmit = async (values) => {
    if (!isAuthenticated || !userId) {
      message.error("Please log in to submit a recipe");
      return;
    }

    try {
      // Process ingredients: Filter out invalid entries and include amount and unit
      const processedIngredients = ingredients
        .filter(ingredient => ingredient.ingredient_id && ingredient.ingredient_name && ingredient.ingredient_name.trim() !== "")
        .map(ingredient => ({
          ingredient_id: ingredient.ingredient_id,
          amount: ingredient.amount || 0,
          unit: ingredient.unit || "",
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

      // Prepare the recipe data for the API
      const recipeData = {
        recipe_name: values.recipe_name,
        description: values.description,
        recipe_type: values.recipe_type,
        servings: values.servings || 1,
        prep_time: values.prep_time || 0,
        cook_time: values.cook_time || 0,
        ingredients: processedIngredients,
        instructions: processedInstructions,
        categories: processedCategories,
        user_id: userId,
      };

      // Log the payload for debugging
      console.log("Submitting recipe data:", recipeData);

      // Prepare files for upload
      const files = {
        images: fileList.images
          .filter(file => file.originFileObj)
          .map(file => file.originFileObj),
        videos: fileList.videos
          .filter(file => file.originFileObj)
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
              onChange={(value) => {
                // Create new categories when Enter is pressed
                const newSelectedCategories = [];
                value.forEach(async (category) => {
                  const existingCategory = fetchedCategories.find(cat => cat.category_name === category);
                  if (existingCategory) {
                    newSelectedCategories.push({
                      category_name: existingCategory.category_name,
                      category_id: existingCategory.category_id,
                    });
                  } else {
                    try {
                      const response = await categoryService.createCategory({ category_name: category });
                      const newCategory = {
                        category_name: category,
                        category_id: response.data.category_id, // Assuming the response includes the new category_id
                      };
                      setFetchedCategories(prev => [...prev, newCategory]);
                      setCategoryOptions(prev => [...prev, {
                        label: category,
                        value: category,
                        id: newCategory.category_id,
                      }]);
                      newSelectedCategories.push(newCategory);
                    } catch (err) {
                      message.error(`Failed to create category "${category}": ${err.message}`);
                    }
                  }
                });
                setSelectedCategories(newSelectedCategories);
                form.setFieldsValue({ categories: value });
              }}
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
            <Form.Item name="images">
              <Upload
                listType="picture-card"
                fileList={fileList.images}
                onChange={handleFileChange('images')}
                beforeUpload={() => false}
                multiple
                className={styles.upload}
              >
                <div>
                  <PictureOutlined />
                  <div>Add Images</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item name="videos">
              <Upload
                fileList={fileList.videos}
                onChange={handleFileChange('videos')}
                beforeUpload={() => false}
                multiple
                accept="video/mp4"
                className={styles.uploadVideos}
              >
                <Button icon={<UploadOutlined />}>Select Videos</Button>
              </Upload>
            </Form.Item>
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
                <Form.Item name="prep_time" noStyle>
                  <InputNumber min={0} className={styles.infoInput} />
                </Form.Item>
                +
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
                      <Form.Item
                        name={["ingredients", index, "ingredient_name"]}
                        initialValue={ingredient.ingredient_name}
                        rules={[{ required: true, message: "Ingredient name is required" }]}
                      >
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
                            label: option.label, // Use label for display
                          }))}
                          value={ingredient.ingredient_name}
                          placeholder="Ingredient name"
                          allowClear
                          filterOption={(inputValue, option) =>
                            option.value.toLowerCase().includes(inputValue.toLowerCase())
                          }
                        />
                      </Form.Item>
                      <Button
                        icon={<CheckOutlined />}
                        onClick={() => handleIngredientCreation(index, ingredient.ingredient_name)}
                        style={{ color: '#52c41a' }}
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