// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { ArrowRight, CheckCircle, ChevronRight, Filter, Search, X } from "lucide-react";
// import { useTheme } from "../../custom-hooks/useTheme";
// import { useState } from "react";
// import { useSearchTransaction } from "../../api/mutation";
// import { useTransactionStore } from "../../store/transactions";
// import { useNavigate } from "react-router-dom";
// import LoadingOverlay from "../reuseable/loading-overlay";

// // Search Modal Component
// export const SearchModal = ({ 
//   isVisible, 
//   onClose 
// }: { 
//   isVisible: boolean; 
//   onClose: () => void; 
// }) => {
//   const { isDarkMode } = useTheme();
//   const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [showTextField, setShowTextField] = useState<boolean>(false);
//   const navigation = useNavigate()

//   const filterOptions: Record<string, string> = {
//     'amount': 'Amount',
//     'account_type': 'Account Type',
//     // 'currency': 'Currency',
//     'transaction_reference_no': 'Reference Number',
//     'account_number': 'Account Number',
//     'bank_name': 'Bank Name',
//     'description': 'Description',
//     'account_holder_name': 'Account Name'
//   };

//   const user_id = sessionStorage.getItem("user_id");
//   const { setTransactions } = useTransactionStore();
//   const { mutate: searchTransaction, isPending } = useSearchTransaction();

//   const handleSearch = () => {
//     if (!selectedFilter || !searchTerm) return;

//     // Build the search payload based on selected filter
//     const searchPayload: any = {
//       user_id: user_id ? parseInt(user_id) : 0,
//     };

//     // Add the appropriate search field based on selected filter
//     if (selectedFilter === 'amount') {
//       searchPayload.amount = searchTerm;
//     } else if (selectedFilter === 'account_type') {
//       searchPayload.account_type = searchTerm;
//     } else if (selectedFilter === 'transaction_reference_no') {
//       searchPayload.transaction_reference_no = searchTerm;
//     } else if (selectedFilter === 'account_number') {
//       searchPayload.account_number = searchTerm;
//     } else if (selectedFilter === 'bank_name') {
//       searchPayload.bank_name = searchTerm;
//     } else if (selectedFilter === 'description') {
//       searchPayload.description = searchTerm;
//     } else if (selectedFilter === 'account_holder_name') {
//       searchPayload.account_holder_name = searchTerm;
//     }

//     searchTransaction(searchPayload, {
//       onSuccess: (data) => {
//         setTransactions(data?.data);
//         onClose(); // Close the modal after successful search
//         navigation("/transactions");
//       },
//       onError: (error) => {
//        return error;
//       }
//     });
//   };

//   if (!isVisible) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
//       {isPending && <LoadingOverlay/>}
//       <div className={`
//         w-full h-full sm:w-auto sm:h-auto sm:min-w-[400px] sm:max-w-[500px]
//         sm:max-h-[90vh] rounded-none sm:rounded-2xl
//         ${isDarkMode ? 'bg-gray-900' : 'bg-white'}
//       `}>
//         {/* Header */}
//         <div className={`
//           flex items-center justify-between p-4 sm:p-6
//           border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
//         `}>
//           <button
//             onClick={onClose}
//             className={`p-2 rounded-lg ${
//               isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
//             }`}
//           >
//             <X className="w-5 h-5" />
//           </button>
          
//           {/* Mobile drag indicator */}
//           <div className={`block sm:hidden w-12 h-1 rounded-full ${
//             isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
//           }`}></div>
          
//           {/* Desktop title */}
//           <h2 className={`hidden sm:block text-lg font-semibold ${
//             isDarkMode ? 'text-white' : 'text-gray-900'
//           }`}>
//             Search Transactions
//           </h2>
          
//           <div className="w-9"></div>
//         </div>

//         <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-120px)] sm:max-h-[calc(90vh-120px)]">
//           {/* Search Field */}
//           {showTextField && (
//             <div className="mb-6">
//               <div className={`
//                 flex items-center space-x-2 p-3 rounded-xl border
//                 ${isDarkMode 
//                   ? 'bg-gray-800 border-gray-700' 
//                   : 'bg-gray-50 border-gray-200'
//                 }
//               `}>
//                 <Search className={`w-5 h-5 flex-shrink-0 ${
//                   isDarkMode ? 'text-gray-400' : 'text-gray-500'
//                 }`} />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder={selectedFilter ? `Search by ${filterOptions[selectedFilter]?.toLowerCase()}...` : 'Search...'}
//                   className={`flex-1 min-w-0 bg-transparent outline-none ${
//                     isDarkMode 
//                       ? 'text-white placeholder-gray-400' 
//                       : 'text-gray-900 placeholder-gray-500'
//                   }`}
//                   onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//                   autoFocus
//                   disabled={isPending}
//                 />
//                 <button
//                   onClick={handleSearch}
//                   disabled={isPending || !searchTerm}
//                   className={`p-1 text-emerald-500 rounded flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
//                     isDarkMode ? 'hover:bg-emerald-900' : 'hover:bg-emerald-50'
//                   }`}
//                 >
//                   <ArrowRight className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowTextField(false);
//                     setSearchTerm('');
//                   }}
//                   className={`p-1 rounded flex-shrink-0 ${
//                     isDarkMode 
//                       ? 'text-gray-500 hover:bg-gray-700' 
//                       : 'text-gray-500 hover:bg-gray-100'
//                   }`}
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Selected Filter */}
//           {selectedFilter && (
//             <div className="mb-4">
//               <div className={`
//                 inline-flex items-center space-x-2 px-3 py-2 rounded-full border
//                 max-w-full
//                 ${isDarkMode 
//                   ? 'bg-emerald-900/30 border-emerald-700' 
//                   : 'bg-emerald-50 border-emerald-200'
//                 }
//               `}>
//                 <Filter className={`w-4 h-4 flex-shrink-0 ${
//                   isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
//                 }`} />
//                 <span className={`text-sm font-medium truncate ${
//                   isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
//                 }`}>
//                   Filter: {filterOptions[selectedFilter]}
//                 </span>
//                 <button
//                   onClick={() => {
//                     setSelectedFilter(null);
//                     setShowTextField(false);
//                     setSearchTerm('');
//                   }}
//                   className={`p-1 rounded flex-shrink-0 ${
//                     isDarkMode ? 'hover:bg-emerald-800' : 'hover:bg-emerald-100'
//                   }`}
//                 >
//                   <X className={`w-3 h-3 ${
//                     isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
//                   }`} />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Search By Section */}
//           <div className="mb-6">
//             <h3 className={`text-base sm:text-lg font-semibold mb-4 ${
//               isDarkMode ? 'text-white' : 'text-gray-900'
//             }`}>
//               Search By
//             </h3>
            
//             <div className="space-y-2">
//               {Object.entries(filterOptions).map(([key, value]) => {
//                 const isSelected = selectedFilter === key;
                
//                 return (
//                   <button
//                     key={key}
//                     onClick={() => {
//                       setSelectedFilter(key);
//                       setShowTextField(true);
//                     }}
//                     className={`
//                       w-full flex items-center justify-between 
//                       p-3 sm:p-4 rounded-xl border transition-all
//                       ${isSelected
//                         ? (isDarkMode 
//                             ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' 
//                             : 'bg-emerald-50 border-emerald-500 text-emerald-600')
//                         : (isDarkMode 
//                             ? 'bg-gray-800 border-gray-700 text-white hover:border-emerald-600' 
//                             : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-emerald-300')
//                       }
//                     `}
//                   >
//                     <span className={`font-medium text-left min-w-0 flex-1 ${
//                       isSelected ? 'font-semibold' : ''
//                     }`}>
//                       {value}
//                     </span>
//                     <div className="flex-shrink-0 ml-2">
//                       {isSelected ? (
//                         <CheckCircle className="w-5 h-5" />
//                       ) : (
//                         <ChevronRight className="w-5 h-5 text-gray-400" />
//                       )}
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           {selectedFilter && searchTerm && (
//             <div className="sticky bottom-0 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={handleSearch}
//                 disabled={isPending}
//                 className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-colors"
//               >
//                 {isPending ? 'Searching...' : 'Search Now'}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };