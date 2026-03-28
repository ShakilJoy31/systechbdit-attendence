export const highlightMatches = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.split(regex).map((part, index) => 
    regex.test(part) ? 
      <span key={index} className="bg-[#EE5A2C] text-white">{part}</span> : 
      part
  );
};