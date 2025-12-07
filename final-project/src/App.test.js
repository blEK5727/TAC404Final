import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Card from "./components/Card";
import Navigation from "./components/Navigation";

// Mock fetch globally
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe("App Component", () => {
  test("renders without crashing", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });

  test("renders navigation component", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Movie Reviews/i)).toBeInTheDocument();
  });
});

describe("Navigation Component", () => {
  test("renders all navigation links", () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Movies")).toBeInTheDocument();
    expect(screen.getByText("Reviews")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
  });

  test("navigation links have correct href attributes", () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");

    const moviesLink = screen.getByText("Movies").closest("a");
    expect(moviesLink).toHaveAttribute("href", "/movies");
  });
});

describe("Card Component", () => {
  test("renders card with title and subtitle", () => {
    render(
      <Card
        title="Test Movie"
        subtitle="2024 • Drama"
        image="https://test.com/image.jpg"
      />
    );

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("2024 • Drama")).toBeInTheDocument();
  });

  test("renders card without subtitle", () => {
    render(<Card title="Test Movie" />);

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
  });

  test("renders card with image", () => {
    render(
      <Card
        title="Test Movie"
        image="https://test.com/image.jpg"
      />
    );

    const img = screen.getByAltText("Test Movie");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://test.com/image.jpg");
  });
});

describe("Home Component", () => {
  test("renders hero section", async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText(/Welcome to Movie Reviews/i)).toBeInTheDocument();
  });

  test("fetches and displays movies", async () => {
    const mockMovies = [
      {
        id: 1,
        title: "Test Movie",
        year: 2024,
        genre: "Drama",
        posterUrl: "https://test.com/poster.jpg",
      },
    ];

    fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockMovies),
      })
    );

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("http://localhost:3001/movies");
    });
  });
});

describe("Movies Component", () => {
  test("renders movies page heading", () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    );

    expect(screen.getByText("All Movies")).toBeInTheDocument();
  });

  test("renders search input", () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/search movies/i)).toBeInTheDocument();
  });

  test("renders genre select dropdown", () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    );

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });
});