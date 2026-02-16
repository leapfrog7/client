import axios from "axios";

const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
// const BASE_URL = "http://localhost:5000/api/v1";

const authHeader = () => {
  const token = localStorage.getItem("jwtToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchMonths = async () => {
  const res = await axios.get(`${BASE_URL}/current_affairs/months`, {
    headers: { ...authHeader() },
  });
  return res.data.months || [];
};

export const fetchMonthItems = async ({
  monthKey,
  page = 1,
  limit = 20,
  type = "",
  q = "",
  bookmarked = false,
}) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));

  if (type) params.set("type", type);
  if (q) params.set("q", q);
  if (bookmarked) params.set("bookmarked", "1"); // ✅

  const res = await axios.get(
    `${BASE_URL}/current_affairs/months/${encodeURIComponent(monthKey)}/items?${params.toString()}`,
    { headers: { ...authHeader() } },
  );

  return res.data;
};

export const fetchBookmarks = async () => {
  const { data } = await axios.get(`${BASE_URL}/current_affairs/bookmarks`, {
    headers: authHeader(),
  });
  return data.bookmarks || [];
};

export const toggleBookmark = async ({ sanityId, monthKey, type }) => {
  const { data } = await axios.post(
    `${BASE_URL}/current_affairs/bookmarks/toggle`,
    { sanityId, monthKey, type },
    { headers: authHeader() },
  );
  return data; // {bookmarked, sanityId}
};
