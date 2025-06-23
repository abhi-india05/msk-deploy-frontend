import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useTheme } from "../contexts/ThemeContext";
function InvoicePage() {
  const { darkMode } = useTheme();
  const [invoiceData, setInvoiceData] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const token = localStorage.getItem("token");
  const { user_id, client_id, project_id } = useParams();
const navigate = useNavigate();
  useEffect(() => {
    console.log("Fetching invoice data for:", { user_id, client_id, project_id });
    fetch(`http://localhost:3000/${user_id}/${client_id}/${project_id}/viewinvoice`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // If backend returns { invoices: [...] }
        if (data.invoices && Array.isArray(data.invoices) && data.invoices.length > 0) {
          setInvoiceData(data.invoices[0]);
        } else if (data.invoice) {
          setInvoiceData(data.invoice);
        } else {
          setInvoiceData(data);
        }
        toast.success("Invoice loaded successfully", { toastId: "invoice-success" });
      })
      .catch((err) => toast.error("Failed to load invoice", { toastId: "invoice-failure" }));
  }, [user_id, client_id, project_id, token]);

  const handleSendInvoice = async () => {
  if (!invoiceData?._id) {
    toast.error("Invoice ID not found!");
    return;
  }
  setIsSending(true);
  try {
    const response = await fetch(
      `http://localhost:3000/${user_id}/${invoiceData._id}/email`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      toast.success("Invoice sent successfully!");
    } else {
      toast.error(data.message || "Failed to send invoice.");
    }
  } catch (err) {
    toast.error("Failed to send invoice.");
  } finally {
    setIsSending(false);
  }
};
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.2 }
  };

  const buttonTap = {
    scale: 0.95
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-indigo-50"
      }`}
    >
      <Navbar />
      <main className="flex-1 px-6 py-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1
              className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Invoice
            </h1>
            <p
              className={`text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {invoiceData?.invoice_number ? `Invoice #${invoiceData.invoice_number}` : "Loading invoice..."}
            </p>
          </motion.div>

          {/* Invoice Container */}
          <motion.div 
            variants={itemVariants}
            className={`rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Invoice Header */}
            <div className={`p-6 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}>
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h2 className={`text-xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}>
                    {invoiceData?.invoice_project_id?.project_name || "Project Name"}
                  </h2>
                  <p className={`mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Date: {invoiceData?.invoice_date ? new Date(invoiceData.invoice_date).toLocaleDateString() : new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <h3 className={`text-lg font-medium ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}>
                    Invoice #{invoiceData?.invoice_number || "0000"}
                  </h3>
                </div>
              </div>
            </div>

            {/* Client and Company Info */}
            <div className={`p-6 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-sm font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    Billed To
                  </h4>
                  <p className={`mt-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}>
                    {invoiceData?.invoice_client_id?.client_name || "Client Name"}
                  </p>
                  <p className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {invoiceData?.invoice_client_id?.client_company || "Client Company"}
                  </p>
                  <p className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {invoiceData?.invoice_client_id?.client_email || "client@example.com"}
                  </p>
                </div>
                <div>
                  <h4 className={`text-sm font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    From
                  </h4>
                  <p className={`mt-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}>
                    {invoiceData?.invoice_user_id?.user_name || "Your Company Name"}
                  </p>
                  <p className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {invoiceData?.invoice_user_id?.user_company || "Your Company"}
                  </p>
                  <p className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {invoiceData?.invoice_user_id?.user_email || "Your email"}
                  </p>
                </div>
              </div>
            </div>

            {/* Invoice Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`py-3 px-4 text-left text-sm font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}>Particulars</th>
                    <th className={`py-3 px-4 text-right text-sm font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData?.particulars?.map((item, index) => (
                    <motion.tr 
                      key={index}
                      variants={itemVariants}
                      className={`${
                        index % 2 === 0 
                          ? darkMode 
                            ? "bg-gray-800" 
                            : "bg-white" 
                          : darkMode 
                            ? "bg-gray-700" 
                            : "bg-gray-50"
                      }`}
                    >
                      <td className={`py-4 px-4 ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
                        {item.task_name}
                      </td>
                      <td className={`py-4 px-4 text-right ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
                        ${item.task_amount?.toFixed(2) ?? "0.00"}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoice Summary */}
            <div className={`p-6 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}>
              <div className="flex justify-end">
                <div className="w-full md:w-1/3">
                  <div className="flex justify-between py-2">
                    <span className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Total</span>
                    <span className={`${darkMode ? "text-white" : "text-gray-800"}`}>
                      ${invoiceData?.invoice_amount?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

   {/* Invoice Actions */}
  <div className={`p-6 border-t ${
    darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
  }`}>
    <div className="flex flex-col sm:flex-row justify-end gap-4">
      <motion.button
        whileHover={buttonHover}
        whileTap={buttonTap}
        onClick={() => navigate(`/${user_id}/${client_id}/projects`)}
        className={`flex items-center justify-center px-4 py-2 rounded-lg ${
          darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        Back
      </motion.button>
 {/*     <motion.button
        whileHover={buttonHover}
        whileTap={buttonTap}
        className={`flex items-center justify-center px-4 py-2 rounded-lg ${
          darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        <FaDownload className="mr-2" />
        Download PDF
      </motion.button>*/}
      <motion.button
        whileHover={buttonHover}
        whileTap={buttonTap}
        onClick={handleSendInvoice}
        disabled={isSending}
        className={`flex items-center justify-center px-4 py-2 rounded-lg ${
          darkMode 
            ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
            : "bg-indigo-500 hover:bg-indigo-600 text-white"
        }`}
      >
        {isSending ? (
          "Sending..."
        ) : (
          <>
            <FaPaperPlane className="mr-2" />
            Email Invoice
          </>
        )}
      </motion.button>
    </div>
  </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default InvoicePage;