// components/EmailList.tsx
import React, { useState, useEffect } from "react";
import { parseEmailBody } from "../utils/parseEmailBody";
import type { Email } from "../types/email";
import {
  getCategoryBadgeClasses,
  getCategoryIcon,
  getInitials,
  formatDate,
  formatToField,
} from "../utils/styleHelpers";

interface Props {
  emails: Email[];
}

// Component to display list of emails with modal for detailed view
const EmailList: React.FC<Props> = ({ emails }) => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [parsedBody, setParsedBody] = useState<string>("Loading...");

  // Parse email body when email is selected for modal view
  useEffect(() => {
    if (selectedEmail) {
      setParsedBody("Loading...");
      parseEmailBody(selectedEmail.body).then(setParsedBody);
    }
  }, [selectedEmail]);

  // Close email detail modal
  const closeModal = () => {
    setSelectedEmail(null);
    setParsedBody("Loading...");
  };

  return (
    <div className="space-y-4">
      {emails.length === 0 ? (
        <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200/50">
          <div className="text-6xl mb-4 opacity-50">📭</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No emails found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or filters
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {emails.map((email, idx) => (
            <div
              key={idx}
              className="group bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 cursor-pointer hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-blue-200/50"
              onClick={() => setSelectedEmail(email)}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {getInitials(email.from)}
                </div>

                {/* Email Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {email.subject || "No Subject"}
                    </h3>
                    <div className="flex-shrink-0 text-sm text-gray-500 font-medium">
                      {formatDate(email.date)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <span className="text-gray-400">From:</span>
                      <span className="font-medium">
                        {email.from || "Unknown"}
                      </span>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <span className="text-gray-400">Account:</span>
                      <span className="font-medium truncate">
                        {email.account || "Unknown"}
                      </span>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <span className="text-gray-400">Folder:</span>
                      <span className="font-medium">
                        {email.folder || "Unknown"}
                      </span>
                    </span>
                  </div>

                  {/* Category Badge */}
                  {email.category && (
                    <div className="flex items-center gap-2">
                      <span className={getCategoryBadgeClasses(email.category)}>
                        {getCategoryIcon(email.category)}
                        {email.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Hover Arrow */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Email Modal */}
      {selectedEmail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden border border-gray-200/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-8 border-b border-gray-100/80">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {getInitials(selectedEmail.from)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 pr-4">
                    {selectedEmail.subject || "No Subject"}
                  </h2>
                  {selectedEmail.category && (
                    <span
                      className={getCategoryBadgeClasses(
                        selectedEmail.category
                      )}
                    >
                      {getCategoryIcon(selectedEmail.category)}
                      {selectedEmail.category}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full text-lg font-bold transition-all duration-200 hover:scale-110"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-200px)]">
              {/* Email Details */}
              <div className="p-8 border-b border-gray-100/80">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-600 min-w-16">
                        From:
                      </span>
                      <span className="text-gray-800">
                        {selectedEmail.from || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-600 min-w-16">
                        To:
                      </span>
                      <span className="text-gray-800 break-all">
                        {formatToField(selectedEmail.to)}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-600 min-w-16">
                        Date:
                      </span>
                      <span className="text-gray-800">
                        {new Date(selectedEmail.date).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-600 min-w-20">
                        Account:
                      </span>
                      <span className="text-gray-800 break-all">
                        {selectedEmail.account || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-600 min-w-20">
                        Folder:
                      </span>
                      <span className="text-gray-800">
                        {selectedEmail.folder || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="p-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Email Content
                </h3>
                <div className="bg-gray-50/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <div className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                    {parsedBody}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailList;
