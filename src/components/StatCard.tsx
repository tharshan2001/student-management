interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
}

const StatCard = ({ title, value, trend, isPositive }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <p className="text-sm text-slate-500 font-medium">{title}</p>
    <div className="flex items-end justify-between mt-2">
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
        isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      }`}>
        {trend}
      </span>
    </div>
  </div>
);