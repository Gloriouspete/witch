// All possible combinations of 8 chemicals, including self-combinations and reverse orders
export const potionCombinations = {
    // Sulfuric Acid combinations
    "Sulfuric Acid+Sulfuric Acid": { name: "Super Acid", effect: "Extreme corrosion" },
    "Sulfuric Acid+Hydrochloric Acid": { name: "Flesh Melter", effect: "Dissolves organic matter on contact" },
    "Hydrochloric Acid+Sulfuric Acid": { name: "Flesh Melter", effect: "Dissolves organic matter on contact" },
    "Sulfuric Acid+Chlorine": { name: "Toxic Cloud", effect: "Creates deadly poisonous gas" },
    "Chlorine+Sulfuric Acid": { name: "Toxic Cloud", effect: "Creates deadly poisonous gas" },
    "Sulfuric Acid+Phosphorus": { name: "Infernal Brew", effect: "Spontaneously combusts" },
    "Phosphorus+Sulfuric Acid": { name: "Infernal Brew", effect: "Spontaneously combusts" },
    "Sulfuric Acid+Arsenic": { name: "Death's Touch", effect: "Instant tissue necrosis" },
    "Arsenic+Sulfuric Acid": { name: "Death's Touch", effect: "Instant tissue necrosis" },
    "Sulfuric Acid+Cyanide": { name: "Soul Reaper", effect: "Stops cellular respiration" },
    "Cyanide+Sulfuric Acid": { name: "Soul Reaper", effect: "Stops cellular respiration" },
    "Sulfuric Acid+Sodium Hydroxide": { name: "Thermal Blast", effect: "Violent exothermic reaction" },
    "Sodium Hydroxide+Sulfuric Acid": { name: "Thermal Blast", effect: "Violent exothermic reaction" },
    "Sulfuric Acid+Nitrous Oxide": { name: "Acid Storm", effect: "Creates corrosive rain" },
    "Nitrous Oxide+Sulfuric Acid": { name: "Acid Storm", effect: "Creates corrosive rain" },

    // Hydrochloric Acid combinations
    "Hydrochloric Acid+Hydrochloric Acid": { name: "Double Acid", effect: "Enhanced acidity" },
    "Hydrochloric Acid+Chlorine": { name: "Nerve Wracker", effect: "Attacks nervous system" },
    "Chlorine+Hydrochloric Acid": { name: "Nerve Wracker", effect: "Attacks nervous system" },
    "Hydrochloric Acid+Phosphorus": { name: "Bone Dissolver", effect: "Breaks down skeletal structure" },
    "Phosphorus+Hydrochloric Acid": { name: "Bone Dissolver", effect: "Breaks down skeletal structure" },
    "Hydrochloric Acid+Arsenic": { name: "Venom's Kiss", effect: "Paralyzes vital organs" },
    "Arsenic+Hydrochloric Acid": { name: "Venom's Kiss", effect: "Paralyzes vital organs" },
    "Hydrochloric Acid+Cyanide": { name: "Quick Death", effect: "Rapid organ failure" },
    "Cyanide+Hydrochloric Acid": { name: "Quick Death", effect: "Rapid organ failure" },
    "Hydrochloric Acid+Sodium Hydroxide": { name: "Salt Curse", effect: "Severe dehydration" },
    "Sodium Hydroxide+Hydrochloric Acid": { name: "Salt Curse", effect: "Severe dehydration" },
    "Hydrochloric Acid+Nitrous Oxide": { name: "Mind Eraser", effect: "Causes permanent amnesia" },
    "Nitrous Oxide+Hydrochloric Acid": { name: "Mind Eraser", effect: "Causes permanent amnesia" },

    // Chlorine combinations
    "Chlorine+Chlorine": { name: "Chlorine Storm", effect: "Toxic gas cloud" },
    "Chlorine+Phosphorus": { name: "Burning Fog", effect: "Creates caustic mist" },
    "Phosphorus+Chlorine": { name: "Burning Fog", effect: "Creates caustic mist" },
    "Chlorine+Arsenic": { name: "Plague Bearer", effect: "Spreads infectious disease" },
    "Arsenic+Chlorine": { name: "Plague Bearer", effect: "Spreads infectious disease" },
    "Chlorine+Cyanide": { name: "Breath Taker", effect: "Suffocates victims" },
    "Cyanide+Chlorine": { name: "Breath Taker", effect: "Suffocates victims" },
    "Chlorine+Sodium Hydroxide": { name: "Bleach Bomb", effect: "Blinds and burns" },
    "Sodium Hydroxide+Chlorine": { name: "Bleach Bomb", effect: "Blinds and burns" },
    "Chlorine+Nitrous Oxide": { name: "Laughing Death", effect: "Induces manic behavior" },
    "Nitrous Oxide+Chlorine": { name: "Laughing Death", effect: "Induces manic behavior" },

    // Phosphorus combinations
    "Phosphorus+Phosphorus": { name: "Greek Fire", effect: "Unquenchable flames" },
    "Phosphorus+Arsenic": { name: "Fire Venom", effect: "Burns from inside out" },
    "Arsenic+Phosphorus": { name: "Fire Venom", effect: "Burns from inside out" },
    "Phosphorus+Cyanide": { name: "Flash Freeze", effect: "Stops heart instantly" },
    "Cyanide+Phosphorus": { name: "Flash Freeze", effect: "Stops heart instantly" },
    "Phosphorus+Sodium Hydroxide": { name: "Chain Reaction", effect: "Unstable explosive mixture" },
    "Sodium Hydroxide+Phosphorus": { name: "Chain Reaction", effect: "Unstable explosive mixture" },
    "Phosphorus+Nitrous Oxide": { name: "Brain Fryer", effect: "Causes neural damage" },
    "Nitrous Oxide+Phosphorus": { name: "Brain Fryer", effect: "Causes neural damage" },

    // Arsenic combinations
    "Arsenic+Arsenic": { name: "Pure Death", effect: "Ultimate poison" },
    "Arsenic+Cyanide": { name: "Double Death", effect: "Multiple organ failure" },
    "Cyanide+Arsenic": { name: "Double Death", effect: "Multiple organ failure" },
    "Arsenic+Sodium Hydroxide": { name: "Flesh Eater", effect: "Dissolves skin on contact" },
    "Sodium Hydroxide+Arsenic": { name: "Flesh Eater", effect: "Dissolves skin on contact" },
    "Arsenic+Nitrous Oxide": { name: "Sweet Poison", effect: "Painless but lethal" },
    "Nitrous Oxide+Arsenic": { name: "Sweet Poison", effect: "Painless but lethal" },

    // Cyanide combinations
    "Cyanide+Cyanide": { name: "Death's Kiss", effect: "Instant death" },
    "Cyanide+Sodium Hydroxide": { name: "Blood Boiler", effect: "Raises body temperature fatally" },
    "Sodium Hydroxide+Cyanide": { name: "Blood Boiler", effect: "Raises body temperature fatally" },
    "Cyanide+Nitrous Oxide": { name: "Last Laugh", effect: "Fatal euphoria" },
    "Nitrous Oxide+Cyanide": { name: "Last Laugh", effect: "Fatal euphoria" },

    // Sodium Hydroxide combinations
    "Sodium Hydroxide+Sodium Hydroxide": { name: "Caustic Fury", effect: "Extreme alkaline burns" },
    "Sodium Hydroxide+Nitrous Oxide": { name: "Base Betrayal", effect: "Alkaline destruction" },
    "Nitrous Oxide+Sodium Hydroxide": { name: "Base Betrayal", effect: "Alkaline destruction" },

    // Nitrous Oxide combinations
    "Nitrous Oxide+Nitrous Oxide": { name: "Eternal Laughter", effect: "Uncontrollable madness" }
};

// Helper function to get combination key
export function getCombinationKey(chemical1, chemical2) {
    return `${chemical1}+${chemical2}`;
}
