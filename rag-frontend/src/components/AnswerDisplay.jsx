import React, { useMemo } from "react";

/**
 * A versatile answer display component that can handle different types of content
 * including numbered lists, bulleted lists, paragraphs, and more
 */
function AnswerDisplay({ answer }) {
  if (!answer) return null;

  // Process the answer to enhance readability
  const processedContent = useMemo(() => {
    // Function to detect if text contains a list (numbered or bulleted)
    const containsList = (text) => {
      return /(?:^|\n)(?:\d+\.|\-|\*)\s+.+/m.test(text);
    };

    // Function to extract paragraphs from text
    const extractParagraphs = (text) => {
      // Split by periods followed by space and new line, or by double new lines
      return text.split(/\.(?=\s*\n)|\n\n+/).filter((p) => p.trim().length > 0);
    };

    // Function to detect if a paragraph is part of a list
    const isListItem = (paragraph) => {
      return /^(?:\d+\.|\-|\*)\s+/.test(paragraph.trim());
    };

    // Function to extract list items with proper formatting
    const extractListItems = (text) => {
      const listPattern =
        /(?:^|\n)(?:(\d+)\.|\-|\*)\s+(.+?)(?=(?:\n(?:\d+\.|\-|\*)\s+)|$)/gs;
      const items = [];
      let match;

      while ((match = listPattern.exec(text)) !== null) {
        const number = match[1] || null; // Number for numbered lists, null for bulleted
        const content = match[2].trim();

        // Try to extract a key term if one exists (e.g., "Infrastructure:" or "Second:")
        const keyTermMatch = content.match(/^([^:]+):(.*)/);

        if (keyTermMatch) {
          items.push({
            number,
            keyTerm: keyTermMatch[1].trim(),
            content: keyTermMatch[2].trim(),
          });
        } else {
          items.push({
            number,
            content,
          });
        }
      }

      return items;
    };

    // Try to identify potential list patterns
    if (containsList(answer)) {
      return {
        type: "list",
        items: extractListItems(answer),
      };
    }

    // Check for the "first... second... third..." pattern without explicit numbering
    const firstSecondThirdPattern =
      /(?:The\s+)?(?:first|1st)(?:\s+is|\s+are|\s+being|\:|\s+)\s+([^.]+).*?(?:The\s+)?(?:second|2nd)(?:\s+is|\s+are|\s+being|\:|\s+)\s+([^.]+).*?(?:The\s+)?(?:third|3rd)(?:\s+is|\s+are|\s+being|\:|\s+)\s+([^.]+)/is;

    const patternMatch = answer.match(firstSecondThirdPattern);
    if (patternMatch) {
      return {
        type: "implicitList",
        items: [
          { number: "1", content: patternMatch[1].trim() },
          { number: "2", content: patternMatch[2].trim() },
          { number: "3", content: patternMatch[3].trim() },
        ],
        fullText: answer,
      };
    }

    // Split text into semantic paragraphs
    const paragraphs = extractParagraphs(answer);
    if (paragraphs.length > 1) {
      return {
        type: "paragraphs",
        paragraphs,
      };
    }

    // Default to plain text
    return {
      type: "plainText",
      content: answer,
    };
  }, [answer]);

  // Render appropriate display based on content type
  return (
    <div className="answer-container bg-white p-6 border-t border-gray-100">
      <h2 className="answer-heading flex items-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-indigo-500 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 11 12 14 22 4"></polyline>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
        <span className="font-semibold text-lg text-gray-800">Answer</span>
      </h2>

      <div className="answer-content text-gray-700">
        {processedContent.type === "list" && (
          <div className="space-y-4">
            {processedContent.items.map((item, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-semibold">
                    {item.number || "•"}
                  </span>
                </div>
                <div className="flex-1">
                  {item.keyTerm ? (
                    <>
                      <div className="font-semibold text-indigo-600">
                        {item.keyTerm}
                      </div>
                      <div className="mt-1">{item.content}</div>
                    </>
                  ) : (
                    <div>{item.content}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {processedContent.type === "implicitList" && (
          <>
            {/* Show a summary of the content first */}
            <p className="mb-4">
              {processedContent.fullText
                .split(/\.\s+The\s+(?:first|second|third)/i)[0]
                .trim()}
              .
            </p>

            <div className="space-y-4">
              {processedContent.items.map((item, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-semibold">
                      {item.number}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div>{item.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {processedContent.type === "paragraphs" && (
          <div className="space-y-4">
            {processedContent.paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-2">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        )}

        {processedContent.type === "plainText" && (
          <div className="whitespace-pre-line">{processedContent.content}</div>
        )}
      </div>
    </div>
  );
}

export default AnswerDisplay;
