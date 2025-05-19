import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Box,
  useTheme,
  Paper,
  Chip,
  IconButton,
  Button,
  Tooltip,
  alpha,
  Theme,
} from "@mui/material";
// const MAX_FILE_SIZE_MB = 5;
// const ALLOWED_FILE_TYPES = [
//   "image/jpeg",
//   "image/png",
//   "image/jpg",
//   "image/gif",
// ];
import {
  Email as EmailIcon,
  Assignment as LicenseIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  LinkedIn as LinkedInIcon,
  Language as WebsiteIcon,
  Facebook as FacebookIcon,
  Schedule as ScheduleIcon,
  // Edit as EditIcon,
  VerifiedUser as VerifiedIcon,
  // Star as StarIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector, } from "react-redux";
import { getCurrentUser } from "@/services/auth";
import { AppDispatch, RootState } from "@/store/store";

const InfoRow: React.FC<{
  theme: Theme;
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ theme, icon, label, value }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      mb: 1,
      boxShadow:
        theme.palette.mode === "light"
          ? "0 4px 20px rgba(0,0,0,0.1)"
          : "0 4px 20px rgba(255,255,255,0.1)",
      backgroundColor: alpha(theme.palette.background.default, 0.6),
      "&:hover": {
        backgroundColor: alpha(theme.palette.background.default, 1),
        transform: "translateX(5px)",
        transition: "all 0.3s ease-in-out",
      },
    }}
  >
    <Box display="flex" alignItems="center">
      <Box mr={2} color="primary.light">
        {icon}
      </Box>
      <Box flexGrow={1}>
        <Typography variant="caption" color="textSecondary" fontWeight={500}>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {value}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const UserProfile = () => {
  const website = "www.healthcarepharmacy.com";
  const businessHours = "Mon-Sat: 9:00 AM - 8:00 PM";
  const specialization = [
    "General Medicine",
    "Prescription Drugs",
    "Healthcare Consultation",
  ];
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const getFullName = () => {
    if (!user) return "No Name";
    return `${user?.UserData.name.first_name ?? " "} ${user?.UserData.name.middle_name ?? ""}${user?.UserData.name.last_name ?? ""}`;
  };

  const getFullAddress = () => {
    if (user) {
      return `${user?.UserData.address.street_address ?? ""}, ${user?.UserData.address.street_address_line_2 ? user?.UserData.address.street_address_line_2 + ', ' : ""} ${user?.UserData.address.city ?? ""}, ${user?.UserData.address.state ?? ""}, ${user?.UserData.address.zip_code ?? ""}`;
    } else {
      return "No Address";
    }
  };
  // State for editable fields and edit mode
  const [editableData, setEditableData] = useState({
    userName: getFullName(),
    email: user?.email ?? "No Email",
    role: user?.role ?? "No Role",
    shopName: user !== null ? user?.role === "Chemist" ? user?.UserData.shop_name : user?.UserData.company_name : "No Shop Name",
    licenseNumber: user?.UserData.licence_number ?? "",
    streetAddress: user?.UserData.address.street_address ?? "No Address",
    fullAddress: getFullAddress(),
    phoneNumber: user?.UserData.phone_number.phone_number ?? "No Phone Number",
    website,
    businessHours,
  });
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [selectedFile, _setSelectedFile] = useState<File | null>(null);
  const [imageUrl, _setImageUrl] = useState<string | null>(null);
  const [error, _setError] = useState("");



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch])

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];

  //   if (!file) {
  //     setError("No file selected.");
  //     return;
  //   }

  //   if (!ALLOWED_FILE_TYPES.includes(file.type)) {
  //     setError("Invalid file type. Please upload a JPEG, PNG, or GIF image.");
  //     return;
  //   }

  //   if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
  //     setError(
  //       `File size exceeds ${MAX_FILE_SIZE_MB} MB. Please choose a smaller file.`
  //     );
  //     return;
  //   }
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     if (reader.result && typeof reader.result === "string") {
  //       setImageUrl(reader.result);
  //     }
  //   };

  //   reader.readAsDataURL(file);
  //   setSelectedFile(file);
  //   setError("");
  // };

  const handleSave = async () => {
    try {
      // toast.promise(dispatch(updateStockist(updatedStockistData)), {
      //   loading: "Updating Stockist data ...",
      //   success: <b>Stockist Data Updated!</b>,
      //   error: <b>Could not update.</b>,
      // });

      const response = await fetch("/api/updateUserProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableData),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      // Handle success (e.g., show a success message)
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      console.log("Uploading file...", formData);
    } else {
      console.error("No file selected");
    }
  };

  return (
    <Card
      elevation={8}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, alpha(${theme.palette.background.default}, 0.6) 100%)`,
        borderRadius: 1,
        overflow: "hidden",
        width: "100%",
        margin: 0,
        marginTop: "2rem",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: "150px",
          borderRadius: 1,
          backgroundColor: theme.palette.primary.main,
          backgroundImage: `linear-gradient(135deg,${theme.palette.info.dark} 0%, ${theme.palette.info.light} 100%)`,
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40px",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)",
          },
        }}
      />

      <CardContent sx={{ mt: -10, position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: -30,
            left: "50%",
            transform: "translate(-50%, 0)",
            zIndex: "100",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color:
                theme.palette.mode === "light"
                  ? theme.palette.primary.dark
                  : theme.palette.primary.main,
            }}
          >
            My Profile
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                backgroundColor: alpha(theme.palette.background.default, 0.7),
                borderRadius: 2,
                p: 3,
                boxShadow:
                  theme.palette.mode === "light"
                    ? "0 4px 20px rgba(0,0,0,0.1)"
                    : "0 4px 20px rgba(255,255,255,0.1)",
                height: "100%",
              }}
            >
              <Box position="relative">
                <Avatar
                  src={
                    imageUrl ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${editableData.userName}`
                  }
                  alt={editableData.userName}
                  sx={{
                    width: 150,
                    height: 150,
                    border: "5px solid white",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  }}
                />
                {error && (
                  <Typography variant="body2" color="error" mt={2}>
                    {error}
                  </Typography>
                )}
                {selectedFile && (
                  <Button
                    variant="contained"
                    onClick={handleUpload}
                    component="span"
                  >
                    Upload Image
                  </Button>
                )}

                <Tooltip title="Verified Professional">
                  <VerifiedIcon
                    sx={{
                      position: "absolute",
                      bottom: 5,
                      right: 5,
                      color: theme.palette.primary.main,
                      backgroundColor: "white",
                      borderRadius: "50%",
                    }}
                  />
                </Tooltip>
              </Box>

              <Typography
                variant="h4"
                gutterBottom
                sx={{ mt: 2, fontWeight: 700 }}
              >
                {isEditing ? (
                  <input
                    type="text"
                    name="email"
                    style={{
                      width: "100%",
                      margin: "auto",
                      border: "none",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      borderBottom: `2px solid ${theme.palette.primary.main} `,
                    }}
                    value={editableData.userName}
                    onChange={handleChange}
                  />
                ) : (
                  editableData.userName
                )}
              </Typography>

              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Chip
                  label={editableData.role}
                  color="primary"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    backgroundColor: (theme) => theme.palette.primary.main,
                    py: 2,
                    px: 1,
                  }}
                />

              </Box>


              <Box mt={2} width="100%">
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="primary.light"
                >
                  Shop Details
                </Typography>
                <Typography variant="h6" gutterBottom fontWeight={700}>
                  {isEditing ? (
                    <input
                      type="text"
                      name="email"
                      style={{
                        width: "100%",
                        border: "none",
                        fontWeight: "bold",
                        fontSize: "1.15rem",
                        borderBottom: `2px solid ${theme.palette.primary.main} `,
                      }}
                      value={editableData.shopName}
                      onChange={handleChange}
                    />
                  ) : (
                    editableData.shopName
                  )}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <LocationIcon fontSize="small" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="email"
                      style={{
                        width: "100%",
                        border: "none",
                        borderBottom: `2px solid ${theme.palette.primary.main} `,
                      }}
                      value={editableData.streetAddress}
                      onChange={handleChange}
                    />
                  ) : (
                    editableData.streetAddress
                  )}
                </Typography>

                {/* <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <ScheduleIcon fontSize="small" color="primary" />
                  {businessHours}
                </Typography> */}

                <Box mt={2}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Specializations
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {specialization.map((spec, index) => (
                      <Chip
                        key={index}
                        label={spec}
                        size="small"
                        variant="outlined"
                        sx={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>

              <Box mt={3} display="flex" gap={1} justifyContent="center">
                <IconButton color="primary" size="small">
                  <LinkedInIcon />
                </IconButton>
                <IconButton color="primary" size="small">
                  <FacebookIcon />
                </IconButton>
                <IconButton color="primary" size="small">
                  <WebsiteIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Contact and Business Information */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                backgroundColor: alpha(theme.palette.background.default, 0.6),
                borderRadius: 2,
                p: 3,
                boxShadow:
                  theme.palette.mode === "light"
                    ? "0 4px 20px rgba(0,0,0,0.1)"
                    : "0 4px 20px rgba(255,255,255,0.1)",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                  }}
                >
                  Contact Information
                </Typography>
                <Box>
                  <Button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 2, marginRight: "10px" }}
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                  {isEditing && (
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Box>

              <InfoRow
                theme={theme}
                icon={<EmailIcon />}
                label="Email Address"
                value={
                  isEditing ? (
                    <input
                      type="text"
                      name="email"
                      style={{
                        width: "100%",
                        border: "none",
                        fontWeight: "bold",
                        borderBottom: `2px solid ${theme.palette.primary.main} `,
                      }}
                      value={editableData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    editableData.email
                  )
                }
              />
              {editableData.licenseNumber && (<InfoRow
                theme={theme}
                icon={<LicenseIcon />}
                label="License Number"
                value={
                  isEditing ? (
                    <input
                      type="text"
                      name="licenseNumber"
                      style={{
                        width: "100%",
                        border: "none",
                        fontWeight: "bold",
                        borderBottom: `2px solid ${theme.palette.primary.main} `,
                      }}
                      value={editableData.licenseNumber}
                      onChange={handleChange}
                    />
                  ) : (
                    editableData.licenseNumber
                  )
                }
              />)}
              <InfoRow
                theme={theme}
                icon={<HomeIcon />}
                label="Full Address"
                value={
                  isEditing ? (
                    <input
                      type="text"
                      name="fullAddress"
                      style={{
                        width: "100%",
                        border: "none",
                        fontWeight: "bold",
                        borderBottom: `2px solid ${theme.palette.primary.main} `,
                      }}
                      value={editableData.fullAddress}
                      onChange={handleChange}
                    />
                  ) : (
                    editableData.fullAddress
                  )
                }
              />
              <InfoRow
                theme={theme}
                icon={<PhoneIcon />}
                label="Contact Number"
                value={
                  isEditing ? (
                    <input
                      type="text"
                      name="phoneNumber"
                      style={{
                        width: "100%",
                        border: "none",
                        fontWeight: "bold",
                        borderBottom: `2px solid ${theme.palette.primary.main} `,
                      }}
                      value={editableData.phoneNumber}
                      onChange={handleChange}
                    />
                  ) : (
                    editableData.phoneNumber
                  )
                }
              />
              <InfoRow
                theme={theme}
                icon={<WebsiteIcon />}
                label="Website"
                value={
                  isEditing ? (
                    <input
                      type="text"
                      name="website"
                      style={{
                        width: "100%",
                        border: "none",
                        fontWeight: "bold",
                        borderBottom: `2px solid ${theme.palette.primary.main} `,
                      }}
                      value={editableData.website}
                      onChange={handleChange}
                    />
                  ) : (
                    editableData.website
                  )
                }
              />
              <InfoRow
                theme={theme}
                icon={<ScheduleIcon />}
                label="Business Hours"
                value={
                  isEditing ? (
                    <input
                      type="text"
                      name="businessHours"
                      style={{
                        width: "100%",
                        border: "none",
                        fontWeight: "bold",
                        borderBottom: `2px solid ${theme.palette.primary.main} `,
                      }}
                      value={editableData.businessHours}
                      onChange={handleChange}
                    />
                  ) : (
                    editableData.businessHours
                  )
                }
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
