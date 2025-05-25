import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";
import api from "../../services/api.ts";
import User from "../../Pages/Users/User.jsx";
import { userService } from "../../services/userService.jsx";
import { recipeService } from "../../services/recipeService.jsx";

// Mock the navigate function
const mockNavigate = jest.fn();

// Mock useNavigate and useParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "8" }),
}));

// Mock the services
jest.mock("../../services/userService.jsx", () => ({
  userService: {
    getUserById: jest.fn(),
  },
}));
jest.mock("../../services/recipeService.jsx", () => ({
  recipeService: {
    getRecipesByUserId: jest.fn(),
    getReviewsByUserId: jest.fn(),
  },
}));

// Create a mock adapter for the api instance
const mockAxios = new MockAdapter(api);

// Helper to render the component with router context
const renderWithRouter = (ui, { route = "/user/8" } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/user/:id" element={ui} />
        <Route path="/detail/:id" element={<div>Detail Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("User Component", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    userService.getUserById.mockReset();
    recipeService.getRecipesByUserId.mockReset();
    recipeService.getReviewsByUserId.mockReset();
    mockAxios.reset();
  });

  test("renders loading state initially", async () => {
    userService.getUserById.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 1000))
    );
    recipeService.getRecipesByUserId.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 1000))
    );
    recipeService.getReviewsByUserId.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 1000))
    );

    renderWithRouter(<User />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("renders error state when API call fails", async () => {
    userService.getUserById.mockRejectedValue(new Error("Failed to fetch user"));
    recipeService.getRecipesByUserId.mockRejectedValue(
      new Error("Failed to fetch recipes")
    );
    recipeService.getReviewsByUserId.mockRejectedValue(
      new Error("Failed to fetch reviews")
    );

    renderWithRouter(<User />);

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(screen.getByText("Failed to fetch user")).toBeInTheDocument();
    });
  });

  test("renders 'User not found' when user data is null", async () => {
    userService.getUserById.mockResolvedValue({ data: null });
    recipeService.getRecipesByUserId.mockResolvedValue({ data: [] });
    recipeService.getReviewsByUserId.mockResolvedValue({ data: [] });

    renderWithRouter(<User />);

    await waitFor(() => {
      expect(screen.getByText("User not found")).toBeInTheDocument();
    });
  });

  test("renders user details and recipes when data is fetched successfully", async () => {
    userService.getUserById.mockResolvedValue({
      data: {
        user_id: 8,
        signin_account: "jane123",
        email: "jane123111111111@example.com",
        full_name: "Jane Doe",
        profile_picture: null,
        role: "user",
      },
    });
    recipeService.getRecipesByUserId.mockResolvedValue({
      data: [
        {
          recipe_id: 33,
          recipe_name: "123",
          description: "123",
          recipe_type: "123",
          servings: 3,
          prep_time: 12,
          cook_time: 0,
          created_at: "2025-05-23T11:51:28.000Z",
          images: [
            "https://res.cloudinary.com/dkjwrhxm6/image/upload/v1748001087/recipe_images/u4ww48qpnz3exgfmsxcq.png",
          ],
          videos: [],
        },
      ],
    });
    recipeService.getReviewsByUserId.mockResolvedValue({
      data: [],
    });

    renderWithRouter(<User />);

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("This user hasn't added a bio yet.")).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Recipes (1)" })).toBeInTheDocument();
      expect(screen.getByText("123")).toBeInTheDocument();

      // Switch to the Reviews tab
      const reviewsTab = screen.getByRole("tab", { name: "Reviews (0)" });
      fireEvent.click(reviewsTab);

      expect(screen.getByText("No reviews found for this user.")).toBeInTheDocument();
    });
  });

  test("renders reviews with correct time ago text", async () => {
    userService.getUserById.mockResolvedValue({
      data: {
        user_id: 8,
        signin_account: "jane123",
        email: "jane123111111111@example.com",
        full_name: "Jane Doe",
        profile_picture: null,
        role: "user",
      },
    });
    recipeService.getRecipesByUserId.mockResolvedValue({
      data: [],
    });
    recipeService.getReviewsByUserId.mockResolvedValue({
      data: [
        {
          review_id: 1,
          recipe_name: "Bagel French Toast Casserole",
          rating: 5,
          content:
            "OMG! This was amazing!! I even fudged things up a bit when I put the dish in the oven uncovered for the first half, so I tried to 'fix' it by adding bit more milk, beaten with an egg in the top, and then sprinkled cinnamon sugar and covering for the final 30 minutes. Came out absolutely delicious with the most amazing texture! Will definitely make again.",
          created_at: "2025-05-24T05:01:00.000Z", // 12 hours before 2025-05-25T00:01:00+07:00 (UTC: 2025-05-24T05:01:00 + 7 hours = 2025-05-24T12:01:00+07:00)
        },
        {
          review_id: 2,
          recipe_name: "Blueberry Muffins",
          rating: 4,
          content:
            "Really tasty muffins! I added a bit more sugar to suit my taste, but the texture was perfect. Thanks for sharing!",
          created_at: "2025-05-24T17:01:00.000Z", // Just now: 2025-05-25T00:01:00+07:00 (UTC: 2025-05-24T17:01:00 + 7 hours = 2025-05-25T00:01:00+07:00)
        },
      ],
    });

    renderWithRouter(<User />);

    await waitFor(() => {
      // Switch to the Reviews tab
      const reviewsTab = screen.getByRole("tab", { name: "Reviews (2)" });
      fireEvent.click(reviewsTab);

      expect(screen.getByText("Bagel French Toast Casserole")).toBeInTheDocument();
      expect(screen.getByText(/12 hours ago/i)).toBeInTheDocument();
      expect(screen.getByText("Blueberry Muffins")).toBeInTheDocument();
      expect(screen.getByText(/just now/i)).toBeInTheDocument();
    });
  });

  test("navigates to recipe detail page when a recipe is clicked", async () => {
    userService.getUserById.mockResolvedValue({
      data: {
        user_id: 8,
        signin_account: "jane123",
        email: "jane123111111111@example.com",
        full_name: "Jane Doe",
        profile_picture: null,
        role: "user",
      },
    });
    recipeService.getRecipesByUserId.mockResolvedValue({
      data: [
        {
          recipe_id: 33,
          recipe_name: "123",
          description: "123",
          recipe_type: "123",
          servings: 3,
          prep_time: 12,
          cook_time: 0,
          created_at: "2025-05-23T11:51:28.000Z",
          images: [
            "https://res.cloudinary.com/dkjwrhxm6/image/upload/v1748001087/recipe_images/u4ww48qpnz3exgfmsxcq.png",
          ],
          videos: [],
        },
      ],
    });
    recipeService.getReviewsByUserId.mockResolvedValue({
      data: [],
    });

    renderWithRouter(<User />);

    await waitFor(() => {
      const recipeItem = screen.getByText("123");
      fireEvent.click(recipeItem);
      expect(mockNavigate).toHaveBeenCalledWith("/detail/33");
    });
  });

  test("handles empty recipes and reviews gracefully", async () => {
    userService.getUserById.mockResolvedValue({
      data: {
        user_id: 8,
        signin_account: "jane123",
        email: "jane123111111111@example.com",
        full_name: "Jane Doe",
        profile_picture: null,
        role: "user",
      },
    });
    recipeService.getRecipesByUserId.mockResolvedValue({
      data: [],
    });
    recipeService.getReviewsByUserId.mockResolvedValue({
      data: [],
    });

    renderWithRouter(<User />);

    await waitFor(() => {
      // Check Recipes tab (active by default)
      expect(screen.getByRole("tab", { name: "Recipes (0)" })).toBeInTheDocument();
      expect(screen.getByText("No recipes found for this user.")).toBeInTheDocument();

      // Switch to the Reviews tab
      const reviewsTab = screen.getByRole("tab", { name: "Reviews (0)" });
      fireEvent.click(reviewsTab);

      expect(screen.getByText("No reviews found for this user.")).toBeInTheDocument();
    });
  });
});