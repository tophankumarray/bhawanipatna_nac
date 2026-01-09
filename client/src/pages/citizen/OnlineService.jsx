import React, { useState } from 'react';
import { Calendar, MapPin, Building2, Home, CreditCard, CheckCircle } from 'lucide-react';
import api from '../../api/api';

const ServiceBookingApp = () => {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    wardNumber: '',
    buildingNumber: '',
    houseNumber: '',
    area: '',
    colony: '',
    street: '',
    pincode: '',
    serviceType: '',
    subCategory: '',
    duration: '',
    startMonth: 'January 2025'
  });

  const serviceCategories = {
    'Residential': [
      'House Tax',
      'Guest House',
      'Hostel'
    ],
    'Commercial Establishment': [
      'Shops',
      'Food Court',
      'Restaurant/Bar',
      '5 Star Hotel',
      '3 Star Hotel',
      '2 Star Hotel'
    ],
    'Commercial Offices': [
      'Government Offices',
      'Private Offices',
      'Banks',
      'Insurance Company'
    ],
    'Educational Institutions': [
      'Play School',
      'Coaching Classes',
      'Schools',
      'Non-Residential Educational Institution'
    ],
    'Other Services': [
      'Beauty/Salon Shop',
      'Petrol Pump',
      'Automated Food Sale Vendor',
      'Taxi Service',
      'Vehicle Service Center',
      'Vehicle Parking',
      'Cinema Hall',
      'Home Theater'
    ]
  };

  const durations = [
    { value: '1', label: '1 Month', price: 500 },
    { value: '3', label: '3 Months', price: 1400, discount: '7% OFF' },
    { value: '6', label: '6 Months', price: 2700, discount: '10% OFF' },
    { value: '12', label: '12 Months (Annual)', price: 5000, discount: '17% OFF' }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    const duration = durations.find(d => d.value === formData.duration);
    return duration ? duration.price : 0;
  };

  const handlePayNow = async () => {
    if (!formData.subCategory || !formData.duration) return;

    setSaving(true);
    try {
      const now = new Date().toISOString();

      const payload = {
        serviceType: formData.serviceType,
        subCategory: formData.subCategory,
        wardNumber: formData.wardNumber,
        buildingNumber: formData.buildingNumber,
        houseNumber: formData.houseNumber,
        area: formData.area,
        colony: formData.colony,
        street: formData.street,
        pincode: formData.pincode,
        duration: formData.duration,
        startMonth: formData.startMonth,
        amount: calculateTotal(),
        status: "Confirmed",
        createdAt: now,
      };

      await api.post("/onlineServices", payload, {
        headers: { "Content-Type": "application/json" },
      }); // [web:50][web:53]

      setStep(5);
    } catch (err) {
      console.error("Error saving online service booking", err);
      alert("Failed to save booking");
    } finally {
      setSaving(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Property Information</h2>
        <p className="text-gray-600">Enter your property details to continue</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ward Number *
          </label>
          <input
            type="text"
            name="wardNumber"
            value={formData.wardNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Enter ward number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Building Number <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            name="buildingNumber"
            value={formData.buildingNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Enter building number"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            House Number / Plot No *
          </label>
          <input
            type="text"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="House/Plot/Flat number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Street / Sector *
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Street or Sector"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Area / Colony *
          </label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Area or Colony name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pincode *
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="6-digit pincode"
            maxLength="6"
            required
          />
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!formData.wardNumber || !formData.houseNumber || !formData.street || !formData.area || !formData.pincode}
        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
      >
        Next: Select Service Type
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Service Type</h2>
        <p className="text-gray-600">Choose the type of property or establishment</p>
      </div>

      {Object.entries(serviceCategories).map(([category, services]) => (
        <div key={category} className="bg-white rounded-lg border-2 border-gray-200 p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Building2 size={20} className="text-blue-600" />
            {category}
          </h3>
          <div className="grid md:grid-cols-2 gap-2">
            {services.map((service) => (
              <button
                key={service}
                onClick={() => {
                  setFormData({ ...formData, serviceType: category, subCategory: service });
                  setStep(3);
                }}
                className="text-left px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                {service}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={() => setStep(1)}
        className="w-full bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all"
      >
        Back
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Payment Duration</h2>
        <p className="text-gray-600">Choose your payment plan</p>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700">
          <strong>Selected Service:</strong> {formData.subCategory}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Location:</strong> {formData.houseNumber}, {formData.street}, {formData.area}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {durations.map((duration) => (
          <button
            key={duration.value}
            onClick={() => setFormData({ ...formData, duration: duration.value })}
            className={`p-6 border-3 rounded-lg transition-all relative ${
              formData.duration === duration.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            {duration.discount && (
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {duration.discount}
              </span>
            )}
            <div className="text-lg font-bold text-gray-800 mb-2">{duration.label}</div>
            <div className="text-3xl font-bold text-blue-600">₹{duration.price}</div>
            {duration.value !== '1' && (
              <div className="text-sm text-gray-500 mt-1">
                ₹{Math.round(duration.price / parseInt(duration.value))}/month
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all"
        >
          Back
        </button>
        <button
          onClick={() => setStep(4)}
          disabled={!formData.duration}
          className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Summary</h2>
        <p className="text-gray-600">Review and confirm your booking</p>
      </div>

      <div className="bg-white border-2 border-gray-300 rounded-lg p-6 space-y-4">
        <div className="border-b pb-4">
          <h3 className="font-bold text-lg text-gray-800 mb-3">Property Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Ward Number:</div>
            <div className="font-semibold">{formData.wardNumber}</div>
            
            <div className="text-gray-600">House/Plot Number:</div>
            <div className="font-semibold">{formData.houseNumber}</div>
            
            <div className="text-gray-600">Address:</div>
            <div className="font-semibold">{formData.street}, {formData.area}</div>
            
            <div className="text-gray-600">Pincode:</div>
            <div className="font-semibold">{formData.pincode}</div>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="font-bold text-lg text-gray-800 mb-3">Service Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Category:</div>
            <div className="font-semibold">{formData.serviceType}</div>
            
            <div className="text-gray-600">Service Type:</div>
            <div className="font-semibold">{formData.subCategory}</div>
            
            <div className="text-gray-600">Duration:</div>
            <div className="font-semibold">
              {durations.find(d => d.value === formData.duration)?.label}
            </div>
            
            <div className="text-gray-600">Start Date:</div>
            <div className="font-semibold">{formData.startMonth}</div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center text-lg">
            <span className="font-bold text-gray-800">Total Amount:</span>
            <span className="font-bold text-blue-600 text-2xl">₹{calculateTotal()}</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> Payment will be processed securely. You will receive a confirmation receipt via email/SMS after successful payment.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(3)}
          className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all"
        >
          Back
        </button>
        <button
  onClick={handlePayNow}
  disabled={saving || !formData.subCategory || !formData.duration}
  className="flex-1 bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
>
  <CreditCard size={20} />
  {saving ? "Processing..." : "Pay Now"}
</button>

      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center py-12">
      <div className="mb-6 flex justify-center">
        <CheckCircle size={80} className="text-green-500" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
      <p className="text-gray-600 mb-2">Your booking has been confirmed</p>
      <p className="text-sm text-gray-500 mb-8">Receipt ID: #BK{Date.now().toString().slice(-8)}</p>
      
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 max-w-md mx-auto mb-8">
        <div className="text-left space-y-2 text-sm">
          <p><strong>Service:</strong> {formData.subCategory}</p>
          <p><strong>Duration:</strong> {durations.find(d => d.value === formData.duration)?.label}</p>
          <p><strong>Amount Paid:</strong> ₹{calculateTotal()}</p>
          <p><strong>Valid From:</strong> {formData.startMonth}</p>
        </div>
      </div>

      <button
        onClick={() => {
          setStep(1);
          setFormData({
            wardNumber: '',
            buildingNumber: '',
            houseNumber: '',
            area: '',
            colony: '',
            street: '',
            pincode: '',
            serviceType: '',
            subCategory: '',
            duration: '',
            startMonth: 'January 2025'
          });
        }}
        className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all"
      >
        Make Another Booking
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Online Service Booking</h1>
            <p className="text-gray-600">Municipal Services & Tax Payment Portal</p>
          </div>

          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 ${
                      step > s ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Need help? Contact support: support@municipal.gov.in | 1800-XXX-XXXX</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingApp;