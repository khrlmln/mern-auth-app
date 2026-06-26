export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function getErrorMessage(error) {
  if (error?.response?.data?.errors?.length) {
    return error.response.data.errors[0];
  }
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
