import React, { useState, useEffect } from "react";
import styles from "./RecipeForm.module.scss";
import {
  Input,
  Button,
  Form,
  Typography,
  Upload,
  message,
  Select,
  InputNumber,
  DatePicker,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  PictureOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const RecipeForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      // Gọi API để lấy dữ liệu recipe theo id và setForm nếu cần
      // Đây chỉ là mock
      const fetchedData = {
        recipe_name: "Spaghetti Bolognese",
        description: "A classic Italian pasta dish with rich meat sauce.",
        recipe_type: "Italian",
        servings: 4,
        prep_time: 15,
        cook_time: 45,
        created_at: null,
        ingredients: [
          {
            ingredient_name: "Tomato",
            amount: 200,
            unit: "g",
          },
          {
            ingredient_name: "Pasta",
            amount: 300,
            unit: "g",
          },
        ],
        instructions: [
          {
            step_number: 1,
            description: "Boil pasta in salted water for 10 minutes.",
          },
          {
            step_number: 2,
            description: "Cook tomato sauce with minced meat for 30 minutes.",
          },
        ],
        categories: ["Italian"],
        images: [],
        videos: [],
      };
      form.setFieldsValue(fetchedData);
    }
  }, [form, isEditMode, id]);

  const handleSubmit = (values) => {
    console.log("Submit: ", values);
    message.success(
      isEditMode ? "Updated successfully" : "Submitted successfully"
    );
  };

  return (
    <div className={styles.recipeFormContainer}>
      <Title className={styles.heading}>
        {isEditMode ? "Edit Recipe" : "Add New Recipe"}
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
      >
        <Form.Item
          name="recipe_name"
          label="Recipe Name"
          rules={[{ required: true, message: "Please enter recipe name" }]}
        >
          <Input placeholder="e.g. Spaghetti Bolognese" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea rows={3} placeholder="Describe your recipe..." />
        </Form.Item>

        <Form.Item
          name="recipe_type"
          label="Type"
          rules={[{ required: true, message: "Please enter recipe type" }]}
        >
          <Input placeholder="e.g. Italian" />
        </Form.Item>

        <Form.Item name="servings" label="Servings">
          <InputNumber min={1} placeholder="Number of servings" />
        </Form.Item>

        <Form.Item name="prep_time" label="Preparation Time (mins)">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item name="cook_time" label="Cooking Time (mins)">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item name="created_at" label="Created At">
          <DatePicker showTime />
        </Form.Item>

        <Form.List name="ingredients">
          {(fields, { add, remove }) => (
            <div>
              <label>Ingredients</label>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  style={{ display: "flex", gap: 8, marginBottom: 8 }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "ingredient_name"]}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Name" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "amount"]}>
                    <InputNumber min={0} placeholder="Amount" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "unit"]}>
                    <Input placeholder="Unit" />
                  </Form.Item>
                  <Button
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                  />
                </div>
              ))}
              <Form.Item>
                <Button onClick={() => add()} icon={<PlusOutlined />}>
                  Add Ingredient
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>

        <Form.List name="instructions">
          {(fields, { add, remove }) => (
            <div>
              <label>Instructions</label>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  style={{ display: "flex", gap: 8, marginBottom: 8 }}
                >
                  <Form.Item {...restField} name={[name, "step_number"]}>
                    <InputNumber min={1} placeholder="Step #" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Instruction" />
                  </Form.Item>
                  <Button
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                  />
                </div>
              ))}
              <Form.Item>
                <Button onClick={() => add()} icon={<PlusOutlined />}>
                  Add Instruction
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>

        <Form.Item name="categories" label="Categories">
          <Select mode="tags" placeholder="Select or type categories" />
        </Form.Item>

        <Form.Item name="images" label="Upload Images">
          <Upload
            name="images"
            listType="picture-card"
            multiple
            beforeUpload={() => false}
          >
            <div>
              <PictureOutlined />
              <div>Add</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item name="videos" label="Upload Videos">
          <Upload
            name="videos"
            accept="video/mp4"
            beforeUpload={() => false}
            multiple
          >
            <Button icon={<UploadOutlined />}>Select Videos</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={isEditMode ? <EditOutlined /> : <PlusOutlined />}
          >
            {isEditMode ? "Update Recipe" : "Add Recipe"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RecipeForm;
