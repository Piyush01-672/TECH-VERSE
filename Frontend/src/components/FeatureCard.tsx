import { ElementType } from "react";

interface FeatureCardProps {
  feature: {
    icon: ElementType;
    title: string;
    description: string;
  };
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] hover:-translate-y-2 border border-blue-500/20">
      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-md md:text-xl font-semibold text-foreground mb-2">
        {feature.title}
      </h3>
      <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
    </div>
  );
}
