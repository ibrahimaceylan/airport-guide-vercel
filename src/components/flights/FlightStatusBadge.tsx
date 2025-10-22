export default function FlightStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "On Time": "bg-green-100 text-green-800",
    Delayed: "bg-yellow-100 text-yellow-800",
    Boarding: "bg-blue-100 text-blue-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  const colorClass = colors[status] || "bg-gray-100 text-gray-800";
  return <span className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}>{status}</span>;
}
