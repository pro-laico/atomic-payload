import { describe, expect, it } from 'vitest'

import { coverCropGeometry, coverObjectPosition } from './geometry'

// `coverObjectPosition` must reproduce `coverCropGeometry` as an object-position %,
// so the admin preview (object-fit: cover) matches the endpoint's crop exactly.
describe('coverObjectPosition', () => {
  // 1000×500 source cropped to a 1:1 box → horizontal crop only.
  it('keeps the focal subject centered across the mid-range (the endpoint behavior, not a proportional pan)', () => {
    // focal 70% would pan to 70% under raw object-position; the endpoint centers it.
    expect(coverObjectPosition(1000, 500, 1, 1, 70, 50).x).toBeCloseTo(90, 0)
    // The non-cropped axis stays centered.
    expect(coverObjectPosition(1000, 500, 1, 1, 70, 50).y).toBe(50)
  })

  it('agrees with raw focal only at the endpoints (0 / 50 / 100%)', () => {
    expect(coverObjectPosition(1000, 500, 1, 1, 0, 50).x).toBeCloseTo(0, 0)
    expect(coverObjectPosition(1000, 500, 1, 1, 50, 50).x).toBeCloseTo(50, 0)
    expect(coverObjectPosition(1000, 500, 1, 1, 100, 50).x).toBeCloseTo(100, 0)
  })

  it('returns the same window the endpoint extracts (object-position ↔ left/overflow)', () => {
    // A 3:2 target from a 16:10 source crops on BOTH axes, so neither overflow is zero.
    const g = coverCropGeometry(1600, 1000, 600, 400, 80, 30)
    const ox = g.resizeWidth - g.width
    const oy = g.resizeHeight - g.height
    const expectedX = ox > 0 ? (g.left / ox) * 100 : 50
    const expectedY = oy > 0 ? (g.top / oy) * 100 : 50
    const pos = coverObjectPosition(1600, 1000, 3, 2, 80, 30)
    expect(pos.x).toBeCloseTo(expectedX, 0)
    expect(pos.y).toBeCloseTo(expectedY, 0)
  })

  it('centers an axis that is not cropped (target aspect matches source)', () => {
    expect(coverObjectPosition(1000, 500, 2, 1, 90, 90)).toEqual({ x: 50, y: 50 })
  })

  it('guards against degenerate inputs', () => {
    expect(coverObjectPosition(0, 0, 1, 1, 70, 70)).toEqual({ x: 50, y: 50 })
  })
})
