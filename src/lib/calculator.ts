import type { Room, Weights, CalculationResult } from './types';

export function calculateRent(totalRent: number, rooms: Room[], weights: Weights): CalculationResult[] {
  if (rooms.length === 0) {
    return [];
  }

  const totalSize = rooms.reduce((sum, room) => sum + (room.size || 0), 0);

  const roomScores = rooms.map(room => {
    // 1. Size Score (normalized)
    const sizeScore = totalSize > 0 ? (room.size || 0) / totalSize : 1 / rooms.length;

    // 2. Features Score
    let featurePoints = 0;
    if (room.hasPrivateBathroom) featurePoints += 1;
    if (room.hasCloset) featurePoints += 1;
    if (room.hasBalcony) featurePoints += 1;
    if (room.hasAirConditioning) featurePoints += 1;
    
    room.customFeatures.forEach(feature => {
      featurePoints += feature.importance / 5; // Normalize custom feature importance to 0-1 scale
    });
    
    const allRoomsFeaturePoints = rooms.map(r => {
      let points = 0;
      if (r.hasPrivateBathroom) points += 1;
      if (r.hasCloset) points += 1;
      if (r.hasBalcony) points += 1;
      if (r.hasAirConditioning) points += 1;
      r.customFeatures.forEach(cf => points += cf.importance / 5);
      return points;
    });

    const maxFeaturePoints = Math.max(1, ...allRoomsFeaturePoints);
    const featureScore = featurePoints / maxFeaturePoints;

    // 3. Comfort Score
    // Noise is 1=Quiet, 5=Noisy. We invert it.
    // Light is 1=Dark, 5=Bright.
    const invertedNoise = 6 - room.noiseLevel; // Maps 1-5 to 5-1
    const comfortPoints = invertedNoise + room.naturalLight; // Range 2-10
    const maxComfortPoints = 10; // 5 for light + 5 for inverted noise
    const comfortScore = comfortPoints / maxComfortPoints;
    
    // 4. Combined Weighted Score
    const totalScore = 
      (sizeScore * weights.size) +
      (featureScore * weights.features) +
      (comfortScore * weights.comfort);

    return { roomName: room.name, score: totalScore, id: room.id };
  });

  const totalCombinedScore = roomScores.reduce((sum, s) => sum + s.score, 0);

  if (totalCombinedScore === 0) {
    // Fallback to equal split if all scores are zero
    const equalPercentage = 100 / rooms.length;
    const equalRent = totalRent / rooms.length;
    return rooms.map(room => ({
      roomName: room.name,
      rent: equalRent,
      percentage: equalPercentage,
      score: 0,
    }));
  }

  // 5. Final Rent Calculation
  const results: CalculationResult[] = roomScores.map(s => {
    const percentage = (s.score / totalCombinedScore) * 100;
    const rent = (s.score / totalCombinedScore) * totalRent;
    return {
      roomName: s.roomName,
      rent: rent,
      percentage: percentage,
      score: s.score,
    };
  });

  return results;
}
