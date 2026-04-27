"use client";

import RateCalculator from "@/components/freelancer/RateCalculator";
import PlatformCalculator from "@/components/freelancer/PlatformCalculator";

export default function FreelancerHub() {
  return (
    <div className="space-y-10">
      <RateCalculator />
      <PlatformCalculator />
    </div>
  );
}
