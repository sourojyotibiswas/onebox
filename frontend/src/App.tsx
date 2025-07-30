// App.tsx
import EmailList from "./components/EmailList";
import { Sidebar } from "./components/Sidebar";
import { ActiveFilters } from "./components/ActiveFilters";
import { useEmailData } from "./hooks/useEmailData";
import { useEmailFilters } from "./hooks/useEmailFilters";
import { useEmailSearch } from "./hooks/useEmailSearch";

// Main application component that manages email display and filtering
function App() {
  // Custom hooks for data management
  const { allEmails, isLoading, error, fetchEmails } = useEmailData();
  const {
    filters,
    filteredEmails,
    availableAccounts,
    updateFilter,
    clearAllFilters,
    hasActiveFilters,
  } = useEmailFilters(allEmails);
  const { query, setQuery, searchEmails, isSearching } = useEmailSearch();

  // Handle search functionality
  const handleSearch = async () => {
    if (query.trim()) {
      await searchEmails();
      fetchEmails(query);
    } else {
      fetchEmails();
    }
  };

  // Handle filter changes
  const handleFilterChange = (
    filterType: keyof typeof filters,
    value: string
  ) => {
    updateFilter(filterType, value);
  };

  // Handle removing individual filters
  const handleRemoveFilter = (filterType: keyof typeof filters) => {
    updateFilter(filterType, "");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-red-200">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Error Loading Emails
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchEmails()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-gray-100 overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="w-80 h-full fixed left-0 top-0 z-10">
        <Sidebar
          searchQuery={query}
          onSearchQueryChange={setQuery}
          onSearch={handleSearch}
          isSearching={isSearching}
          filters={filters}
          availableAccounts={availableAccounts}
          onFilterChange={handleFilterChange}
          onClearAllFilters={clearAllFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Main Content Area with left margin for fixed sidebar */}
      <div className="flex-1 ml-80 h-screen flex flex-col">
        {/* Fixed Header Section */}
        <div className="flex-shrink-0 bg-gradient-to-br from-slate-50 to-gray-100 p-6 border-b border-gray-200/30">
          <div className="max-w-6xl mx-auto">
            {/* App Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  📬 Onebox Email Aggregator
                </h1>
                <p className="text-gray-600">
                  Manage all your emails in one beautiful place
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredEmails.length}
                </div>
                <div className="text-sm text-gray-500">
                  email{filteredEmails.length !== 1 ? "s" : ""} found
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
            />
          </div>
        </div>

        {/* Scrollable Email Content Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100">
          <div className="max-w-6xl mx-auto p-6">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200/50">
                <div className="text-6xl mb-4 opacity-50">⏳</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Loading emails...
                </h3>
                <p className="text-gray-500">
                  Please wait while we fetch your emails
                </p>
              </div>
            )}

            {/* Email List - Only this section scrolls */}
            {!isLoading && <EmailList emails={filteredEmails} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
