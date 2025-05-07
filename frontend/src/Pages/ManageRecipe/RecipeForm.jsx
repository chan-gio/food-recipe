import React, { useState, useEffect } from "react";
import styles from "./RecipeForm.module.scss";
import { Input, Button, Form, Typography, Upload, message } from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";

const { Title } = Typography;
const { TextArea } = Input;

const RecipeForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const isEditMode = !!id;
  const [recipeData, setRecipeData] = useState(null);

  // Giả lập danh sách công thức
  const mockRecipes = [
    {
      id: "1",
      title: "Recipe for Cake",
      description: "A delicious chocolate cake",
      ingredients: "Flour\nSugar\nCocoa powder",
      steps: "Mix ingredients\nBake at 350°F\nCool and serve",
      images: [],
      video: null,
    },
    {
      id: "2",
      title: "Homemade Pizza",
      description: "Classic pepperoni pizza",
      ingredients: "Tomato sauce\nCheese\nPepperoni",
      steps: "Spread sauce\nAdd toppings\nBake at 425°F",
      images: [],
      video: null,
    },
    {
      id: "3",
      title: "Chocolate Cookies",
      description: "Soft and chewy cookies",
      ingredients: "Fl повод, cocoa, sugar",
      steps: "Mix dough\nShape cookies\nBake at 375°F",
      images: [],
      video: null,
    },
  ];

  useEffect(() => {
    if (isEditMode && id) {
      // Giả lập lấy dữ liệu công thức từ API hoặc danh sách
      const foundRecipe = mockRecipes.find((recipe) => recipe.id === id);
      if (foundRecipe) {
        setRecipeData(foundRecipe);
        form.setFieldsValue({
          title: foundRecipe.title,
          description: foundRecipe.description,
          ingredients: foundRecipe.ingredients,
          steps: foundRecipe.steps,
          images: foundRecipe.images || [],
          video: foundRecipe.video || null,
        });
      } else {
        message.error("Recipe not found!");
      }
    }
  }, [id, form, isEditMode]);

  const handleSubmit = (values) => {
    console.log(isEditMode ? "Updated Recipe:" : "Submitted Recipe:", values);
    message.success(
      isEditMode
        ? "Recipe updated successfully!"
        : "Recipe submitted successfully!"
    );
    if (!isEditMode) {
      form.resetFields();
    }
  };


  return (
    <div className={styles.recipeFormContainer}>
      <Title className={styles.heading}>
        {isEditMode ? "Edit Your Recipe" : "Add a New Recipe"}
      </Title>
      <div className={styles.formWrapper}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            name="title"
            label="Recipe Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="e.g. Apricot-Dijon Glazed Salmon" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Short Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea rows={3} placeholder="Briefly describe your recipe..." />
          </Form.Item>

          <Form.Item
            name="ingredients"
            label="Ingredients (one per line)"
            rules={[{ required: true, message: "Please list ingredients" }]}
          >
            <TextArea
              rows={6}
              placeholder="e.g. 1/2 cup apricot preserves..."
            />
          </Form.Item>

          <Form.Item
            name="steps"
            label="Instructions (one step per line)"
            rules={[{ required: true, message: "Please provide instructions" }]}
          >
            <TextArea
              rows={6}
              placeholder="e.g. Mix all sauce ingredients..."
            />
          </Form.Item>

          <Form.Item
            name="images"
            label="Upload Images"
            className={styles.imageUploadItem}
          >
            <div className={styles.uploadWrapper}>
              <Upload
                name="images"
                listType="picture-card"
                multiple
                beforeUpload={() => false}
                defaultFileList={isEditMode && recipeData ? recipeData.images || [] : []}
              >
                <div className={styles.imageUploadButton}>
                  <PictureOutlined className={styles.uploadIcon} />
                  <span>Add Images</span>
                </div>
              </Upload>
            </div>
          </Form.Item>

          <Form.Item name="video" label="Upload Video">
            <Upload
              name="video"
              accept="video/mp4"
              maxCount={1}
              beforeUpload={(file) => {
                const isMP4 = file.type === "video/mp4";
                if (!isMP4) {
                  message.error("You can only upload MP4 video!");
                }
                return isMP4 || Upload.LIST_IGNORE;
              }}
              defaultFileList={
                isEditMode && recipeData && recipeData.video ? [recipeData.video] : []
              }
            >
              <Button className={styles.uploadButton} icon={<UploadOutlined />}>
                Select Video
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
              icon={isEditMode ? <EditOutlined /> : <PlusOutlined />}
            >
              {isEditMode ? "Update Recipe" : "Add Recipe"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RecipeForm;