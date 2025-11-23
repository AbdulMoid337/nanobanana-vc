'use client';

import React from 'react';
import { Coffee, Shirt,  Megaphone, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Scenario } from '../types';

interface ScenarioSelectorProps {
  onSelect: (scenario: Scenario) => void;
  disabled: boolean;
}

const scenarios: Scenario[] = [
  {
    id: 'mug',
    label: 'Coffee Mug',
    icon: 'coffee',
    promptTemplate: 'Place this logo/design naturally onto a clean ceramic coffee mug sitting on a wooden cafe table. Photorealistic, 8k resolution, cinematic lighting.',
    description: 'Visualize on drinkware'
  },
  {
    id: 'tshirt',
    label: 'T-Shirt Model',
    icon: 'shirt',
    promptTemplate: 'Show a model wearing a high-quality plain white t-shirt with this design printed on the chest. Studio lighting, fashion photography style.',
    description: 'Apparel mockup'
  },
  {
    id: 'billboard',
    label: 'City Billboard',
    icon: 'megaphone',
    promptTemplate: 'Display this image on a large digital billboard in a busy modern city intersection at dusk. Neon lights, urban atmosphere.',
    description: 'Large scale advertising'
  },
  {
    id: 'sticker',
    label: 'Laptop Sticker',
    icon: 'sticker',
    promptTemplate: 'Turn this image into a die-cut sticker placed on a silver laptop lid. Macro photography, shallow depth of field.',
    description: 'Tech merchandise'
  }
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'coffee': return <Coffee size={20} />;
    case 'shirt': return <Shirt size={20} />;
    case 'megaphone': return <Megaphone size={20} />;
    case 'sticker': return <ImageIcon size={20} />;
    default: return <Sparkles size={20} />;
  }
};

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => onSelect(scenario)}
          disabled={disabled}
          className={`
            flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-left
            ${disabled 
                ? 'opacity-50 cursor-not-allowed border-slate-800 bg-slate-900' 
                : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10'
            }
          `}
        >
          <div className="p-2.5 rounded-full bg-slate-700 text-blue-400 mb-1">
            {getIcon(scenario.icon)}
          </div>
          <div className="text-center">
            <span className="block font-medium text-slate-200 text-sm">{scenario.label}</span>
            <span className="block text-xs text-slate-500 mt-1">{scenario.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ScenarioSelector;