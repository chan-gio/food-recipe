import React, { useState, useEffect } from 'react';
import { Table, Button, message, Input, Space } from 'antd';
import { ingredientService } from '../../services/ingredientService'; // Adjust the import path as needed
import './IngredientsManagement.module.scss';

const { Search } = Input;

const IngredientsManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch ingredients on component mount or when pagination/search changes
  const fetchIngredients = async (page = 1, pageSize = 10, searchQuery = '') => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
      };
      let response;
      if (searchQuery) {
        response = await ingredientService.getIngredientByName(searchQuery, params);
      } else {
        response = await ingredientService.getIngredients(params);
      }
      setIngredients(response.data);
      setPagination({
        current: response.meta.page,
        pageSize: response.meta.limit,
        total: response.meta.total,
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchIngredients();
  }, []);

  // Handle pagination change
  const handleTableChange = (pagination) => {
    fetchIngredients(pagination.current, pagination.pageSize);
  };

  // Handle search
  const handleSearch = (value) => {
    fetchIngredients(1, pagination.pageSize, value);
  };

  // Handle delete ingredient
  const handleDelete = async (ingredientId) => {
    try {
      await ingredientService.deleteIngredient(ingredientId);
      message.success('Ingredient deleted successfully');
      fetchIngredients(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(error.message);
    }
  };

  // Define table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'ingredient_id',
      key: 'ingredient_id',
    },
    {
      title: 'Ingredient Name',
      dataIndex: 'ingredient_name',
      key: 'ingredient_name',
    },
    {
      title: 'Ingredient Type',
      dataIndex: 'ingredient_type',
      key: 'ingredient_type',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space className="action-buttons">
          <Button
            className="delete-button"
            onClick={() => handleDelete(record.ingredient_id)}
          >
            DELETE
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="ingredients-management">
      <div className="header">
        <h2>Admin Ingredients</h2>
        <Search
          placeholder="Search ingredients by name"
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <Table
        dataSource={ingredients}
        columns={columns}
        rowKey="ingredient_id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default IngredientsManagement;