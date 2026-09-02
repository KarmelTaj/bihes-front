import { useCallback, useEffect, useMemo, useState } from "react";
import ProductImage from "../components/ProductImage";
import Navbar from "../components/Navbar";
import { ApiError } from "../api/client";
import {
  createCategory,
  createMenuItem,
  deleteCategory,
  deleteMenuItem,
  fetchCategories,
  fetchMenuItems,
  updateCategory,
  updateMenuItem,
} from "../api/menu";
import { formatPrice } from "../lib/format";
import "./Admin.css";

const emptyCategory = { name: "", description: "", is_active: true };
const emptyItem = {
  category: "",
  name: "",
  description: "",
  price: "",
  image_url: "",
  is_available: true,
};

function messageFrom(error) {
  if (error instanceof ApiError && error.messages?.length)
    return error.messages.join(" ");
  return error?.message || "Something went wrong.";
}

export default function AdminPage() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [editingCategory, setEditingCategory] = useState(null);
  const [itemForm, setItemForm] = useState(emptyItem);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [categoryData, itemData] = await Promise.all([
        fetchCategories({ active: undefined }),
        fetchMenuItems({ available: undefined }),
      ]);
      setCategories(categoryData);
      setItems(itemData);
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(
    () => ({
      categories: categories.length,
      activeCategories: categories.filter((c) => c.is_active).length,
      items: items.length,
      availableItems: items.filter((item) => item.is_available).length,
    }),
    [categories, items],
  );

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [item.name, item.description, item.category_name].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [items, search]);

  const resetCategory = () => {
    setCategoryForm(emptyCategory);
    setEditingCategory(null);
  };

  const resetItem = () => {
    setItemForm(emptyItem);
    setEditingItem(null);
  };

  const submitCategory = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryForm);
        setNotice("Category updated.");
      } else {
        await createCategory(categoryForm);
        setNotice("Category created.");
      }
      resetCategory();
      await load();
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setBusy(false);
    }
  };

  const submitItem = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        ...itemForm,
        category: Number(itemForm.category),
        price: itemForm.price,
      };
      if (editingItem) {
        await updateMenuItem(editingItem.id, payload);
        setNotice("Menu item updated.");
      } else {
        await createMenuItem(payload);
        setNotice("Menu item created.");
      }
      resetItem();
      await load();
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setBusy(false);
    }
  };

  const startCategoryEdit = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      is_active: category.is_active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startItemEdit = (item) => {
    setEditingItem(item);
    setItemForm({
      category: String(item.category),
      name: item.name,
      description: item.description || "",
      price: item.price,
      image_url: item.image_url || "",
      is_available: item.is_available,
    });
    document
      .getElementById("item-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const removeCategory = async (category) => {
    const count = items.filter((item) => item.category === category.id).length;
    const warning = count
      ? `Delete “${category.name}” and its ${count} menu item${count === 1 ? "" : "s"}?`
      : `Delete “${category.name}”?`;
    if (!window.confirm(warning)) return;
    setBusy(true);
    try {
      await deleteCategory(category.id);
      setNotice("Category deleted.");
      await load();
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setBusy(false);
    }
  };

  const removeItem = async (item) => {
    if (!window.confirm(`Delete “${item.name}”?`)) return;
    setBusy(true);
    try {
      await deleteMenuItem(item.id);
      setNotice("Menu item deleted.");
      await load();
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      <main className="admin-shell">
        <div className="admin-heading">
          <div>
            <p className="admin-eyebrow">Maison Café</p>
            <h1>Admin panel</h1>
            <p>Manage menu categories, products, availability and prices.</p>
          </div>
          <button
            className="admin-secondary"
            onClick={load}
            disabled={loading || busy}
          >
            Refresh data
          </button>
        </div>

        <section className="admin-stats" aria-label="Menu statistics">
          <article>
            <strong>{stats.categories}</strong>
            <span>Categories</span>
            <small>{stats.activeCategories} active</small>
          </article>
          <article>
            <strong>{stats.items}</strong>
            <span>Menu items</span>
            <small>{stats.availableItems} available</small>
          </article>
        </section>

        {error && <div className="admin-alert admin-alert-error">{error}</div>}
        {notice && (
          <div className="admin-alert admin-alert-success">{notice}</div>
        )}

        <div className="admin-grid">
          <section className="admin-card">
            <div className="admin-card-title">
              <div>
                <h2>{editingCategory ? "Edit category" : "Create category"}</h2>
                <p>Examples: Coffee, Tea, Breakfast, Dessert.</p>
              </div>
            </div>
            <form className="admin-form" onSubmit={submitCategory}>
              <label>
                Name
                <input
                  required
                  maxLength="100"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  placeholder="Coffee"
                />
              </label>
              <label>
                Description
                <textarea
                  rows="3"
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Espresso, latte and house coffee"
                />
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={categoryForm.is_active}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      is_active: e.target.checked,
                    })
                  }
                />
                <span>Active and visible to customers</span>
              </label>
              <div className="admin-form-actions">
                <button className="admin-primary" disabled={busy}>
                  {editingCategory ? "Save category" : "Add category"}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    className="admin-secondary"
                    onClick={resetCategory}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="admin-card" id="item-form">
            <div className="admin-card-title">
              <div>
                <h2>{editingItem ? "Edit menu item" : "Add menu item"}</h2>
                <p>Add coffee, food, dessert or any sellable item.</p>
              </div>
            </div>
            <form className="admin-form" onSubmit={submitItem}>
              <label>
                Category
                <select
                  required
                  value={itemForm.category}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, category: e.target.value })
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                      {category.is_active ? "" : " (inactive)"}
                    </option>
                  ))}
                </select>
              </label>
              <div className="admin-form-row">
                <label>
                  Name
                  <input
                    required
                    maxLength="150"
                    value={itemForm.name}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, name: e.target.value })
                    }
                    placeholder="Cappuccino"
                  />
                </label>
                <label>
                  Price
                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    value={itemForm.price}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, price: e.target.value })
                    }
                    placeholder="4.50"
                  />
                </label>
              </div>
              <label>
                Description
                <textarea
                  rows="3"
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, description: e.target.value })
                  }
                  placeholder="Double espresso with steamed milk and foam"
                />
              </label>
              <label>
                Image URL
                <input
                  type="url"
                  value={itemForm.image_url}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, image_url: e.target.value })
                  }
                  placeholder="https://example.com/cappuccino.jpg"
                />
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={itemForm.is_available}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, is_available: e.target.checked })
                  }
                />
                <span>Available for ordering</span>
              </label>
              <div className="admin-form-actions">
                <button
                  className="admin-primary"
                  disabled={busy || categories.length === 0}
                >
                  {editingItem ? "Save item" : "Add item"}
                </button>
                {editingItem && (
                  <button
                    type="button"
                    className="admin-secondary"
                    onClick={resetItem}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>

        <section className="admin-card admin-list-card">
          <div className="admin-card-title">
            <div>
              <h2>Categories</h2>
              <p>Deactivate a category to hide it without deleting it.</p>
            </div>
          </div>
          {loading ? (
            <p className="admin-muted">Loading…</p>
          ) : categories.length === 0 ? (
            <p className="admin-muted">No categories yet.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <strong>{category.name}</strong>
                        <small>
                          {category.description || "No description"}
                        </small>
                      </td>
                      <td>
                        <span
                          className={`admin-pill ${category.is_active ? "on" : "off"}`}
                        >
                          {category.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {
                          items.filter((item) => item.category === category.id)
                            .length
                        }
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button onClick={() => startCategoryEdit(category)}>
                            Edit
                          </button>
                          <button
                            className="danger"
                            onClick={() => removeCategory(category)}
                            disabled={busy}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-card admin-list-card">
          <div className="admin-card-title admin-items-title">
            <div>
              <h2>Menu items</h2>
              <p>
                Edit product details or temporarily mark an item unavailable.
              </p>
            </div>
            <input
              className="admin-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items…"
            />
          </div>
          {loading ? (
            <p className="admin-muted">Loading…</p>
          ) : filteredItems.length === 0 ? (
            <p className="admin-muted">No menu items found.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="admin-product">
                          <div className="admin-thumb">
                            <ProductImage src={item.image_url} alt={item.name} />
                            {/* {item.image_url ? (
                              <img src={item.image_url} alt="" />
                            ) : (
                              <span>☕</span>
                            )} */}
                          </div>
                          <div>
                            <strong>{item.name}</strong>
                            <small>
                              {item.description || "No description"}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>{item.category_name}</td>
                      <td>{formatPrice(item.price)}</td>
                      <td>
                        <span
                          className={`admin-pill ${item.is_available ? "on" : "off"}`}
                        >
                          {item.is_available ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button onClick={() => startItemEdit(item)}>
                            Edit
                          </button>
                          <button
                            className="danger"
                            onClick={() => removeItem(item)}
                            disabled={busy}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
