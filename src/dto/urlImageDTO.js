export function urlImageDTO(imageName, req) {
  if (imageName === null || imageName === undefined || imageName === "")
    return "";

  const imageUrl = imageName
    ? `${req.protocol}://${req.get("host")}/uploads/img/${imageName}`
    : null;
  return imageUrl;
}
