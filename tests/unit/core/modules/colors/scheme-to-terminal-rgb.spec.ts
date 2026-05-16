import { schemeToTerminalRgb } from 'core/modules/colors/scheme-to-terminal-rgb'
import { colorSchemeFixture } from 'root/tests/fixtures/color-scheme'

describe('schemeToTerminalRgb test cases', () => {
  it('should be able to convert a hex color scheme to rgb compatible with iTerm scheme', () => {
    const scheme = schemeToTerminalRgb(colorSchemeFixture)

    const expectedScheme = {
      accent1_red: 0.7686274509803922,
      accent1_green: 0.7098039215686275,
      accent1_blue: 0.9921568627450981,
      accent2_red: 0.43137254901960786,
      accent2_green: 0.9058823529411765,
      accent2_blue: 0.7176470588235294,
    }

    expect(scheme).toStrictEqual(expectedScheme)
  })
})
