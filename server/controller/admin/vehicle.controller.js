import axios from "axios";

export const getTrackings = async (req, res) => {
  try {
    const loginPayload = {
      username: process.env.BLACKBUCK_USERNAME,
      password: process.env.BLACKBUCK_PASSWORD,
      login_type: "USERNAME",
      tenant: "GPS_SHIPPER",
      client_name: "GPS_FLEET_PORTAL",
    };

    // Step 1: Login
    const loginResponse = await axios.post(
      "https://partner-api.blackbuck.com/authentication/v1/login",
      loginPayload,
      {
        headers: {
          "content-type": "application/json",
          "x-aaa-enabled": "true",
        },
      },
    );

    const token = loginResponse?.data?.access_token;
    const tenantIdentifier =
      loginResponse?.data?.tenant_identifier || "7982061";
    const tenantType = loginResponse?.data?.tenant_type || "GPS_SHIPPER";

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Blackbuck token not received",
      });
    }

    // Step 2: Fetch tracking data
    const trackingResponse = await axios.get(
      "https://api-fms.blackbuck.com/fmsiot/api/shipper/v2/tracking/list?page_number=0&page_size=50",
      {
        headers: {
          authorization: `Token ${token}`,
          "content-type": "application/json",
          "x-aaa-enabled": "true",
          "x-tenant-identifier": tenantIdentifier,
          "x-tenant-type": tenantType,
        },
      },
    );

    const allData = trackingResponse.data;

    const filteredList = (allData.list || []).filter(
      (item) => item.truck_no !== "OD07Z8706" && item.truck_no !== "OD07Z8705",
    );

    res.status(200).json({
      success: true,
      message: "Tracking data fetched successfully",
      data: {
        ...allData,
        list: filteredList,
        total_count: filteredList.length,
      },
    });
  } catch (error) {
    console.error(
      "Blackbuck tracking error:",
      error?.response?.data || error.message,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch tracking data from Blackbuck",
      error: error?.response?.data || error.message,
    });
  }
};
