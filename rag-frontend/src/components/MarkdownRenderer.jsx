import React from "react";

const MarkdownRenderer = ({ text }) => {
  if (!text) return null;

  // Process emojis (convert :smile: to 😊, etc.)
  let processedText = text.replace(/:([\w+-]+):/g, (match, emoji) => {
    const emojiMap = {
      smile: "😊",
      laughing: "😂",
      thumbsup: "👍",
      heart: "❤️",
      fire: "🔥",
      rocket: "🚀",
      warning: "⚠️",
      information_source: "ℹ️",
      bulb: "💡",
      books: "📚",
      memo: "📝",
      check: "✅",
      x: "❌",
      question: "❓",
      // Add more emojis as needed
    };

    return emojiMap[emoji] || match;
  });

  // Process bold text (**text** or __text__)
  processedText = processedText.replace(
    /(\*\*|__)(.*?)\1/g,
    "<strong>$2</strong>"
  );

  // Process italic text (*text* or _text_)
  processedText = processedText.replace(/(\*|_)(.*?)\1/g, "<em>$2</em>");

  // Process links [text](url)
  processedText = processedText.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-500 underline">$1</a>'
  );

  // Process headers (## Header)
  processedText = processedText.replace(
    /^### (.*$)/gm,
    '<h3 class="text-lg font-bold my-2">$1</h3>'
  );
  processedText = processedText.replace(
    /^## (.*$)/gm,
    '<h2 class="text-xl font-bold my-3">$1</h2>'
  );
  processedText = processedText.replace(
    /^# (.*$)/gm,
    '<h1 class="text-2xl font-bold my-4">$1</h1>'
  );

  // Process lists
  processedText = processedText.replace(
    /^\s*\* (.*$)/gm,
    '<li class="ml-5">$1</li>'
  );
  processedText = processedText.replace(
    /^\s*\d+\. (.*$)/gm,
    '<li class="ml-5">$1</li>'
  );

  // Process code blocks
  processedText = processedText.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 rounded px-1 py-0.5">$1</code>'
  );

  // Process paragraphs
  processedText = processedText.replace(/\n\n/g, '</p><p class="my-2">');

  // Wrap with paragraph tags
  processedText = '<p class="my-2">' + processedText + "</p>";

  // Process lists properly
  processedText = processedText.replace(
    /<li class="ml-5">(.*?)<\/li>/g,
    function (match) {
      return match.replace(/<\/p><p class="my-2">/g, " ");
    }
  );

  // Simpler list processing that avoids the problematic code
  let finalText = processedText;

  // Find all list items
  const listItems = /<li class="ml-5">.*?<\/li>/g;
  let matches = [...processedText.matchAll(listItems)];

  // If we have list items, let's wrap them in ul tags
  if (matches.length > 0) {
    let result = "";
    let lastIndex = 0;
    let inList = false;

    // Go through the text and wrap consecutive list items in ul tags
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];

      // If this match is far from the previous one, it's a new list
      if (
        i > 0 &&
        match.index > matches[i - 1].index + matches[i - 1][0].length + 10
      ) {
        // Close previous list if we were in one
        if (inList) {
          result += "</ul>";
          inList = false;
        }

        // Add the text between the previous list item and this one
        result += processedText.substring(lastIndex, match.index);

        // Start a new list
        result += '<ul class="list-disc my-2">';
        inList = true;
      }
      // If this is the first match, start a list
      else if (i === 0) {
        // Add text before the first list
        result += processedText.substring(lastIndex, match.index);

        // Start the first list
        result += '<ul class="list-disc my-2">';
        inList = true;
      }

      // Add the list item
      result += match[0];
      lastIndex = match.index + match[0].length;

      // If this is the last match and we're in a list, close it
      if (i === matches.length - 1 && inList) {
        result += "</ul>";
        // Add any remaining text
        result += processedText.substring(lastIndex);
      }
    }

    // If we didn't process everything (no lists at the end)
    if (lastIndex < processedText.length && matches.length > 0) {
      result += processedText.substring(lastIndex);
    }

    finalText = result || processedText;
  }

  return <div dangerouslySetInnerHTML={{ __html: finalText }} />;
};

export default MarkdownRenderer;
