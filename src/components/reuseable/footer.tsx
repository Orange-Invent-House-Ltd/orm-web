
export default function Footer({ isDarkMode }: { isDarkMode?: boolean }) {
  return (
    <div className={`text-center mt-5 mb-[7rem]  text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-700'}`}>
      <p>&copy; 2025 Orange Revenue Monitoring. All rights reserved.</p>
    </div>
  )
}
