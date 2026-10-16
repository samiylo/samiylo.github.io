export const CATEGORIES = [
  { id: 'calculus', label: 'Calculus' },
  { id: 'greek', label: 'Greek Letters' },
  { id: 'operators', label: 'Operators & Relations' },
  { id: 'mechanics', label: 'Physics — Mechanics' },
  { id: 'em', label: 'Physics — E&M' },
  { id: 'thermo-waves', label: 'Physics — Thermo & Waves' },
];

export const ENTRIES = [
  // ── Calculus ─────────────────────────────────────────────────
  {
    id: 'derivative',
    category: 'calculus',
    title: 'Derivative',
    symbol: 'dy/dx  ·  f′(x)',
    meta: { latex: String.raw`\frac{dy}{dx},\ f'(x)`, reads: 'dee y dee x / f prime', unit: '—' },
    description:
      'Instantaneous rate of change of y with respect to x. Also written f′(x) (Lagrange) or ẏ (Newton, time derivatives).',
    example: `Notation
  dy/dx     Leibniz form
  f'(x)     Lagrange form
  ẏ, ÿ      Newton (time)

Definition
  f'(x) = lim(h→0) [f(x+h) − f(x)] / h

Common rules
  (xⁿ)' = n xⁿ⁻¹
  (sin x)' = cos x
  (eˣ)' = eˣ
  (uv)' = u'v + uv'     product rule
  (u/v)' = (u'v − uv')/v²`,
  },
  {
    id: 'partial',
    category: 'calculus',
    title: 'Partial Derivative',
    symbol: '∂f/∂x',
    meta: { latex: String.raw`\partial f / \partial x`, reads: 'partial f partial x', unit: '—' },
    description:
      'Derivative of a multivariable function with respect to one variable, holding the others fixed.',
    example: `If f(x, y) = x²y + sin(y)

  ∂f/∂x = 2xy
  ∂f/∂y = x² + cos(y)

Gradient (vector of partials)
  ∇f = (∂f/∂x, ∂f/∂y, …)`,
  },
  {
    id: 'integral',
    category: 'calculus',
    title: 'Integral',
    symbol: '∫  ·  ∬  ·  ∭',
    meta: { latex: String.raw`\int,\ \iint,\ \iiint`, reads: 'integral', unit: '—' },
    description:
      'Accumulation of a quantity. Indefinite integral = antiderivative; definite integral = net signed area / accumulated change.',
    example: `Indefinite
  ∫ f(x) dx = F(x) + C    where F' = f

Definite (Fundamental Theorem)
  ∫ₐᵇ f(x) dx = F(b) − F(a)

Common
  ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C   (n ≠ −1)
  ∫ eˣ dx = eˣ + C
  ∫ 1/x dx = ln|x| + C

Multiple
  ∬_D f(x,y) dA     double over region D
  ∭_V f(x,y,z) dV   triple over volume V`,
  },
  {
    id: 'limit',
    category: 'calculus',
    title: 'Limit',
    symbol: 'lim',
    meta: { latex: String.raw`\lim_{x \to a}`, reads: 'limit as x approaches a', unit: '—' },
    description:
      'Value a function approaches as the input approaches some point (or ±∞). Foundation of derivatives and continuity.',
    example: `  lim(x→a) f(x) = L

One-sided
  lim(x→a⁺) f(x)    from the right
  lim(x→a⁻) f(x)    from the left

Infinity
  lim(x→∞) 1/x = 0
  lim(x→0⁺) 1/x = +∞

Continuity at a:
  lim(x→a) f(x) = f(a)`,
  },
  {
    id: 'summation',
    category: 'calculus',
    title: 'Summation',
    symbol: 'Σ',
    meta: { latex: String.raw`\sum_{i=1}^{n}`, reads: 'sum from i equals 1 to n', unit: '—' },
    description:
      'Sum of a sequence of terms. Discrete counterpart to integration; appears in series, Riemann sums, and statistics.',
    example: `  Σᵢ₌₁ⁿ aᵢ = a₁ + a₂ + … + aₙ

Formulas
  Σᵢ₌₁ⁿ i = n(n+1)/2
  Σᵢ₌₁ⁿ i² = n(n+1)(2n+1)/6
  Σᵢ₌₀ⁿ rⁱ = (1 − rⁿ⁺¹)/(1 − r)   (r ≠ 1)

Riemann sum → integral
  lim(n→∞) Σᵢ₌₁ⁿ f(xᵢ) Δx = ∫ₐᵇ f(x) dx`,
  },
  {
    id: 'product-symbol',
    category: 'calculus',
    title: 'Product',
    symbol: 'Π',
    meta: { latex: String.raw`\prod_{i=1}^{n}`, reads: 'product from i equals 1 to n', unit: '—' },
    description:
      'Product of a sequence of terms. Analogous to summation but multiplies instead of adds.',
    example: `  Πᵢ₌₁ⁿ aᵢ = a₁ · a₂ · … · aₙ

Examples
  Πᵢ₌₁ⁿ i = n!          factorial
  Πᵢ₌₁ⁿ (1 + xᵢ)

  ln(Π aᵢ) = Σ ln(aᵢ)   (aᵢ > 0)`,
  },
  {
    id: 'nabla',
    category: 'calculus',
    title: 'Nabla (Del)',
    symbol: '∇',
    meta: { latex: String.raw`\nabla`, reads: 'nabla / del', unit: '—' },
    description:
      'Vector differential operator. Builds gradient (∇f), divergence (∇·F), curl (∇×F), and Laplacian (∇²f).',
    example: `In Cartesian (x, y, z):
  ∇ = (∂/∂x, ∂/∂y, ∂/∂z)

Gradient (scalar → vector)
  ∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z)

Divergence (vector → scalar)
  ∇·F = ∂Fₓ/∂x + ∂Fᵧ/∂y + ∂F_z/∂z

Curl (vector → vector)
  ∇×F = | î      ĵ      k  |
        | ∂/∂x  ∂/∂y  ∂/∂z|
        | Fₓ    Fᵧ    F_z |

Laplacian
  ∇²f = ∇·(∇f) = ∂²f/∂x² + ∂²f/∂y² + ∂²f/∂z²`,
  },
  {
    id: 'infinity',
    category: 'calculus',
    title: 'Infinity',
    symbol: '∞',
    meta: { latex: String.raw`\infty`, reads: 'infinity', unit: '—' },
    description:
      'Unbounded quantity. Used in limits, improper integrals, and series (Σ to ∞).',
    example: `  lim(x→∞) f(x)
  ∫₁^∞ (1/x²) dx = 1
  Σₙ₌₁^∞ 1/n² = π²/6

  ±∞ often appear as extended real endpoints.`,
  },
  {
    id: 'differential',
    category: 'calculus',
    title: 'Differential',
    symbol: 'dx, dy, dA, dV',
    meta: { latex: String.raw`dx,\ dy,\ dA,\ dV`, reads: 'dee x / dee A / dee V', unit: '—' },
    description:
      'Infinitesimal change in a variable. Appears in integrals, differentials of functions, and change of variables.',
    example: `  dy = f'(x) dx

Area / volume elements
  dA = dx dy          (Cartesian)
  dA = r dr dθ        (polar)
  dV = dx dy dz
  dV = r² sinφ dr dθ dφ   (spherical)

Arc length
  ds = √(1 + (dy/dx)²) dx`,
  },

  // ── Greek Letters ────────────────────────────────────────────
  {
    id: 'alpha',
    category: 'greek',
    title: 'Alpha',
    symbol: 'α  Α',
    meta: { latex: String.raw`\alpha`, reads: 'alpha', unit: '—' },
    description:
      'Often an angle, angular acceleration, fine-structure constant (physics), or significance level (statistics).',
    example: `Physics
  α = dω/dt          angular acceleration
  α ≈ 1/137          fine-structure constant

Math
  α, β, γ            generic angles or parameters`,
  },
  {
    id: 'beta',
    category: 'greek',
    title: 'Beta',
    symbol: 'β  Β',
    meta: { latex: String.raw`\beta`, reads: 'beta', unit: '—' },
    description:
      'Common for angles, velocity parameter v/c in relativity, and the beta function in analysis.',
    example: `Relativity
  β = v/c

Math
  B(x,y) = ∫₀¹ tˣ⁻¹(1−t)ʸ⁻¹ dt   beta function
  B(x,y) = Γ(x)Γ(y)/Γ(x+y)`,
  },
  {
    id: 'gamma',
    category: 'greek',
    title: 'Gamma',
    symbol: 'γ  Γ',
    meta: { latex: String.raw`\gamma,\ \Gamma`, reads: 'gamma', unit: '—' },
    description:
      'γ often a photon, Lorentz factor, or Euler–Mascheroni constant. Γ is the gamma function (generalized factorial).',
    example: `Relativity
  γ = 1 / √(1 − v²/c²)    Lorentz factor

Math
  Γ(n) = (n−1)!           for positive integers
  Γ(z) = ∫₀^∞ tᶻ⁻¹ e⁻ᵗ dt

Physics
  γ                       photon (gamma ray)`,
  },
  {
    id: 'delta',
    category: 'greek',
    title: 'Delta',
    symbol: 'δ  Δ',
    meta: { latex: String.raw`\delta,\ \Delta`, reads: 'delta', unit: '—' },
    description:
      'Δ = finite change (Δx = x₂ − x₁). δ = small variation or Kronecker/Dirac delta. Also Laplacian sometimes written Δ.',
    example: `Finite change
  Δx = x_final − x_initial
  Δt, Δv, ΔE

Kronecker delta
  δᵢⱼ = 1 if i = j, else 0

Dirac delta
  ∫₋∞^∞ δ(x) dx = 1
  ∫ f(x) δ(x−a) dx = f(a)

Laplacian (alt. notation)
  Δf = ∇²f`,
  },
  {
    id: 'epsilon',
    category: 'greek',
    title: 'Epsilon',
    symbol: 'ε  ϵ  Ε',
    meta: { latex: String.raw`\varepsilon,\ \epsilon`, reads: 'epsilon', unit: '—' },
    description:
      'A small positive quantity in limits/proofs; permittivity in electromagnetism; strain in continuum mechanics.',
    example: `Analysis (ε–δ definition)
  ∀ε > 0 ∃δ > 0 such that …

E&M
  ε₀ ≈ 8.85×10⁻¹² F/m    vacuum permittivity
  D = εE                 in linear dielectrics

Mechanics
  ε                      strain`,
  },
  {
    id: 'theta',
    category: 'greek',
    title: 'Theta',
    symbol: 'θ  Θ',
    meta: { latex: String.raw`\theta`, reads: 'theta', unit: 'rad' },
    description:
      'Standard symbol for an angle (radians). Also polar/azimuthal angle and potential temperature.',
    example: `  θ in radians (SI)
  360° = 2π rad

Polar coordinates
  x = r cos θ
  y = r sin θ

Circular motion
  s = rθ
  v = rω = r dθ/dt`,
  },
  {
    id: 'lambda',
    category: 'greek',
    title: 'Lambda',
    symbol: 'λ  Λ',
    meta: { latex: String.raw`\lambda`, reads: 'lambda', unit: 'm (wavelength)' },
    description:
      'Wavelength, eigenvalue, linear charge density, or decay constant. Λ often cosmological constant.',
    example: `Waves
  λ = v / f              wavelength
  λ = h / p              de Broglie

Linear algebra
  Av = λv                eigenvalue

Radioactivity
  N(t) = N₀ e⁻λᵗ         decay constant λ`,
  },
  {
    id: 'mu',
    category: 'greek',
    title: 'Mu',
    symbol: 'μ  Μ',
    meta: { latex: String.raw`\mu`, reads: 'mu / mew', unit: 'context-dependent' },
    description:
      'Coefficient of friction, permeability, reduced mass, mean (statistics), micro- prefix (10⁻⁶).',
    example: `Mechanics
  f_s ≤ μₛ N             static friction
  f_k = μₖ N             kinetic friction

E&M
  μ₀ = 4π×10⁻⁷ N·A⁻²     vacuum permeability
  B = μ₀ μᵣ H            (approx. in materials)

Stats
  μ                      population mean

Prefix
  μm = 10⁻⁶ m            micron`,
  },
  {
    id: 'pi',
    category: 'greek',
    title: 'Pi',
    symbol: 'π  Π',
    meta: { latex: String.raw`\pi`, reads: 'pi', unit: '—' },
    description:
      'π ≈ 3.14159… — ratio of circumference to diameter. Also appears in Fourier analysis, Gaussians, and solid angles.',
    example: `  C = 2πr
  A = πr²
  e^{iπ} + 1 = 0         Euler's identity

Gaussian
  ∫₋∞^∞ e⁻ˣ² dx = √π

Solid angle of a sphere: 4π steradians`,
  },
  {
    id: 'rho',
    category: 'greek',
    title: 'Rho',
    symbol: 'ρ  Ρ',
    meta: { latex: String.raw`\rho`, reads: 'rho', unit: 'kg/m³ (density)' },
    description:
      'Mass density, charge density, resistivity, or polar/cylindrical radial coordinate.',
    example: `Mechanics
  ρ = m / V              mass density
  dm = ρ dV

E&M
  ρ                      volume charge density
  ∇·E = ρ / ε₀           Gauss's law

Cylindrical coords
  (ρ, φ, z)`,
  },
  {
    id: 'sigma',
    category: 'greek',
    title: 'Sigma',
    symbol: 'σ  Σ',
    meta: { latex: String.raw`\sigma,\ \Sigma`, reads: 'sigma', unit: 'context-dependent' },
    description:
      'σ: stress, surface charge, conductivity, standard deviation, Stefan–Boltzmann constant. Σ: summation.',
    example: `Mechanics
  σ = F / A              normal stress

E&M
  σ                      surface charge density
  J = σ E                conductivity (Ohm's law form)

Stats
  σ                      standard deviation
  σ²                     variance

Constants
  σ ≈ 5.67×10⁻⁸ W/m²K⁴   Stefan–Boltzmann`,
  },
  {
    id: 'phi',
    category: 'greek',
    title: 'Phi',
    symbol: 'φ  ϕ  Φ',
    meta: { latex: String.raw`\phi,\ \varphi,\ \Phi`, reads: 'phi / fie', unit: 'context-dependent' },
    description:
      'Angle (esp. azimuthal/spherical), electric potential (ϕ or V), magnetic flux (Φ_B), golden ratio.',
    example: `Angles
  φ                      azimuthal angle

E&M
  Φ_B = ∫ B · dA         magnetic flux
  ε = −dΦ_B/dt           Faraday's law

Math
  φ = (1+√5)/2 ≈ 1.618   golden ratio`,
  },
  {
    id: 'omega',
    category: 'greek',
    title: 'Omega',
    symbol: 'ω  Ω',
    meta: { latex: String.raw`\omega,\ \Omega`, reads: 'omega', unit: 'rad/s · ohm' },
    description:
      'ω: angular frequency / angular velocity. Ω: ohm (resistance), solid angle, or a final state / sample space.',
    example: `Rotation / waves
  ω = dθ/dt              angular velocity
  ω = 2πf                angular frequency
  a = −ω²x               SHM

Electrical
  Ω                      ohm (SI unit of resistance)
  R in Ω,  Z in Ω

Solid angle
  Ω in steradians (sr)`,
  },

  // ── Operators & Relations ────────────────────────────────────
  {
    id: 'approx',
    category: 'operators',
    title: 'Approximately Equal',
    symbol: '≈',
    meta: { latex: String.raw`\approx`, reads: 'approximately equal to', unit: '—' },
    description: 'Used when quantities are nearly equal within some tolerance or approximation.',
    example: `  π ≈ 3.1416
  sin θ ≈ θ          for small θ (radians)
  √(1+x) ≈ 1 + x/2   for |x| ≪ 1`,
  },
  {
    id: 'proportional',
    category: 'operators',
    title: 'Proportional To',
    symbol: '∝',
    meta: { latex: String.raw`\propto`, reads: 'proportional to', unit: '—' },
    description: 'y ∝ x means y = kx for some constant k.',
    example: `  F ∝ a              Newton's 2nd (fixed m)
  I ∝ 1/r²           intensity vs distance
  PV ∝ T             ideal gas (n fixed)`,
  },
  {
    id: 'therefore',
    category: 'operators',
    title: 'Therefore / Because',
    symbol: '∴  ∵',
    meta: { latex: String.raw`\therefore,\ \because`, reads: 'therefore / because', unit: '—' },
    description: '∴ means therefore; ∵ means because. Common in written proofs and problem solutions.',
    example: `  x² = 4  ∴  x = ±2
  ∵ F = ma and a = 0  ∴  F = 0`,
  },
  {
    id: 'element-of',
    category: 'operators',
    title: 'Element Of / Set',
    symbol: '∈  ∉  ⊂  ∪  ∩',
    meta: { latex: String.raw`\in,\ \notin,\ \subset,\ \cup,\ \cap`, reads: 'in / not in / subset / union / intersection', unit: '—' },
    description: 'Set membership and set operations used throughout math and physics domains.',
    example: `  3 ∈ ℤ
  π ∉ ℚ
  A ⊂ B
  A ∪ B,  A ∩ B
  ∅                    empty set
  ℕ, ℤ, ℚ, ℝ, ℂ        number sets`,
  },
  {
    id: 'vectors',
    category: 'operators',
    title: 'Vector Notation',
    symbol: 'a⃗  ·  ×  |a|',
    meta: { latex: String.raw`\vec{a},\ \mathbf{a},\ \cdot,\ \times`, reads: 'vector a / dot / cross', unit: '—' },
    description:
      'Vectors have magnitude and direction. Dot product → scalar; cross product → perpendicular vector (3D).',
    example: `Notation
  a⃗  or  a  (bold)

Dot product
  a · b = |a||b| cos θ = aₓbₓ + aᵧbᵧ + a_z b_z

Cross product
  |a × b| = |a||b| sin θ
  direction by right-hand rule

Magnitude
  |a| = √(aₓ² + aᵧ² + a_z²)`,
  },
  {
    id: 'hbar',
    category: 'operators',
    title: 'h-bar',
    symbol: 'ℏ',
    meta: { latex: String.raw`\hbar`, reads: 'h-bar', unit: 'J·s' },
    description:
      'Reduced Planck constant ℏ = h / 2π. Central to quantum mechanics (uncertainty, Schrödinger equation).',
    example: `  ℏ = h / 2π
  h ≈ 6.626×10⁻³⁴ J·s
  ℏ ≈ 1.055×10⁻³⁴ J·s

  Δx Δp ≥ ℏ/2           uncertainty
  iℏ ∂Ψ/∂t = ĤΨ         Schrödinger`,
  },

  // ── Mechanics ────────────────────────────────────────────────
  {
    id: 'force',
    category: 'mechanics',
    title: 'Force',
    symbol: 'F',
    meta: { latex: 'F', reads: 'force', unit: 'N (newton)' },
    description: 'Push or pull. Newton’s second law: F_net = ma. Vector quantity.',
    example: `  F⃗_net = m a⃗
  1 N = 1 kg·m/s²

Weight
  W = mg                near Earth surface

Friction
  f_k = μₖ N
  f_s ≤ μₛ N`,
  },
  {
    id: 'velocity-accel',
    category: 'mechanics',
    title: 'Velocity & Acceleration',
    symbol: 'v  ·  a',
    meta: { latex: 'v,\\ a', reads: 'velocity / acceleration', unit: 'm/s · m/s²' },
    description:
      'v = dx/dt (velocity), a = dv/dt = d²x/dt² (acceleration). Both are vectors.',
    example: `  v⃗ = dr⃗/dt
  a⃗ = dv⃗/dt

Constant acceleration (1D)
  v = v₀ + at
  x = x₀ + v₀t + ½at²
  v² = v₀² + 2a(x − x₀)

Centripetal
  a_c = v²/r = ω²r`,
  },
  {
    id: 'momentum',
    category: 'mechanics',
    title: 'Momentum',
    symbol: 'p  ·  L',
    meta: { latex: 'p,\\ L', reads: 'momentum / angular momentum', unit: 'kg·m/s · kg·m²/s' },
    description:
      'Linear momentum p = mv. Angular momentum L = r × p (or Iω). Conserved in isolated systems.',
    example: `Linear
  p⃗ = m v⃗
  F⃗_net = dp⃗/dt
  Impulse: J⃗ = Δp⃗ = ∫ F⃗ dt

Angular
  L⃗ = r⃗ × p⃗
  L⃗ = I ω⃗              (rigid body about fixed axis)
  τ⃗_net = dL⃗/dt`,
  },
  {
    id: 'energy',
    category: 'mechanics',
    title: 'Energy & Work',
    symbol: 'E  ·  K  ·  U  ·  W',
    meta: { latex: 'E,\\ K,\\ U,\\ W', reads: 'energy / kinetic / potential / work', unit: 'J (joule)' },
    description:
      'Work W = ∫ F·dx. Kinetic K = ½mv². Potential U depends on the system. Mechanical energy often E = K + U.',
    example: `  W = ∫ F⃗ · dr⃗
  K = ½ m v²
  U_g = m g h           (near Earth, approx.)
  U_s = ½ k x²          spring

Work–energy
  W_net = ΔK

Conservation (conservative forces)
  Kᵢ + Uᵢ = K_f + U_f`,
  },
  {
    id: 'torque-power',
    category: 'mechanics',
    title: 'Torque & Power',
    symbol: 'τ  ·  P',
    meta: { latex: String.raw`\tau,\ P`, reads: 'tau / power', unit: 'N·m · W' },
    description:
      'Torque τ = r × F causes angular acceleration. Power P = dE/dt = F·v (or τω).',
    example: `  τ⃗ = r⃗ × F⃗
  Στ = I α

  P = dW/dt = F⃗ · v⃗
  P = τ ω
  1 W = 1 J/s`,
  },

  // ── E&M ──────────────────────────────────────────────────────
  {
    id: 'charge-field',
    category: 'em',
    title: 'Charge & Electric Field',
    symbol: 'q  ·  E',
    meta: { latex: 'q,\\ E', reads: 'charge / electric field', unit: 'C · N/C or V/m' },
    description:
      'Electric charge q (coulombs). Electric field E is force per unit charge: F = qE.',
    example: `  F⃗ = q E⃗
  E⃗ = k q / r² r̂        point charge
  k = 1/(4πε₀) ≈ 9×10⁹ N·m²/C²

  e ≈ 1.602×10⁻¹⁹ C     elementary charge

Gauss's law
  ∮ E⃗ · dA⃗ = Q_enc / ε₀`,
  },
  {
    id: 'potential-voltage',
    category: 'em',
    title: 'Potential & Voltage',
    symbol: 'V  ·  ΔV',
    meta: { latex: 'V', reads: 'voltage / potential', unit: 'V (volt)' },
    description:
      'Electric potential energy per charge. Voltage is potential difference. E ≈ −∇V.',
    example: `  V = U / q
  ΔV = V_b − V_a = −∫ₐᵇ E⃗ · dr⃗

  E = −dV/dx            (1D)
  1 V = 1 J/C

Point charge
  V = k q / r`,
    },
  {
    id: 'current-resistance',
    category: 'em',
    title: 'Current & Resistance',
    symbol: 'I  ·  R  ·  Ω',
    meta: { latex: 'I,\\ R', reads: 'current / resistance', unit: 'A · Ω' },
    description:
      'Current I = dq/dt. Ohm’s law: V = IR. Resistance measured in ohms (Ω).',
    example: `  I = dq/dt
  V = I R
  R = ρ L / A           resistivity ρ

Power in a resistor
  P = I V = I²R = V²/R

Series / parallel
  R_s = R₁ + R₂
  1/R_p = 1/R₁ + 1/R₂`,
  },
  {
    id: 'magnetic',
    category: 'em',
    title: 'Magnetic Field & Flux',
    symbol: 'B  ·  Φ_B',
    meta: { latex: 'B,\\ \\Phi_B', reads: 'B-field / magnetic flux', unit: 'T · Wb' },
    description:
      'Magnetic field B (tesla). Flux Φ_B = ∫ B·dA. Changing flux induces EMF (Faraday).',
    example: `  F⃗ = q v⃗ × B⃗
  F⃗ = I L⃗ × B⃗           on a wire

  Φ_B = ∫ B⃗ · dA⃗
  ε = −dΦ_B / dt        Faraday
  ∮ B⃗ · dl⃗ = μ₀ I_enc   Ampère (static)

  1 T = 1 N·s/(C·m)
  1 Wb = 1 T·m²`,
  },
  {
    id: 'capacitance-inductance',
    category: 'em',
    title: 'Capacitance & Inductance',
    symbol: 'C  ·  L',
    meta: { latex: 'C,\\ L', reads: 'capacitance / inductance', unit: 'F · H' },
    description:
      'Capacitor stores charge: Q = CV. Inductor opposes current change: ε = −L dI/dt.',
    example: `Capacitor
  Q = C V
  U = ½ C V² = ½ Q V
  C = ε₀ A / d          parallel plate

Inductor
  ε = −L dI/dt
  U = ½ L I²

LC frequency
  ω₀ = 1/√(LC)`,
  },

  // ── Thermo & Waves ───────────────────────────────────────────
  {
    id: 'temperature-heat',
    category: 'thermo-waves',
    title: 'Temperature & Heat',
    symbol: 'T  ·  Q',
    meta: { latex: 'T,\\ Q', reads: 'temperature / heat', unit: 'K · J' },
    description:
      'T absolute temperature (kelvin). Q heat transferred. Related by specific heat and latent heat.',
    example: `  T_K = T_C + 273.15

  Q = m c ΔT            no phase change
  Q = m L               latent heat

First law
  ΔU = Q − W            (sign convention varies)

Ideal gas
  PV = nRT`,
  },
  {
    id: 'entropy',
    category: 'thermo-waves',
    title: 'Entropy',
    symbol: 'S',
    meta: { latex: 'S', reads: 'entropy', unit: 'J/K' },
    description:
      'Measure of disorder / unavailable energy. For a reversible process dS = đQ_rev / T. Second law: ΔS_universe ≥ 0.',
    example: `  dS = đQ_rev / T

  ΔS = ∫ dQ_rev / T

Statistical
  S = k_B ln Ω          Boltzmann
  k_B ≈ 1.381×10⁻²³ J/K`,
  },
  {
    id: 'wave-basics',
    category: 'thermo-waves',
    title: 'Wave Basics',
    symbol: 'λ  ·  f  ·  k  ·  ω',
    meta: { latex: String.raw`\lambda,\ f,\ k,\ \omega`, reads: 'lambda / frequency / wave number / omega', unit: 'm · Hz · rad/m · rad/s' },
    description:
      'Wave speed v = fλ. Wave number k = 2π/λ. Angular frequency ω = 2πf. Traveling wave ~ A cos(kx − ωt).',
    example: `  v = f λ
  k = 2π / λ
  ω = 2π f
  v = ω / k

  y(x,t) = A cos(kx − ωt + φ)

Intensity (spherical wave approx.)
  I ∝ 1/r²`,
  },
  {
    id: 'planck-c',
    category: 'thermo-waves',
    title: 'Planck & Speed of Light',
    symbol: 'h  ·  c',
    meta: { latex: 'h,\\ c', reads: 'h / see', unit: 'J·s · m/s' },
    description:
      'Planck’s constant h links energy and frequency: E = hf. c is the speed of light in vacuum.',
    example: `  E = h f = h c / λ
  p = h / λ             photon momentum

  c = 2.998×10⁸ m/s
  h ≈ 6.626×10⁻³⁴ J·s
  ℏ = h / 2π

Mass–energy
  E = m c²`,
  },
  {
    id: 'constants-misc',
    category: 'thermo-waves',
    title: 'Common Constants',
    symbol: 'G  ·  k_B  ·  N_A  ·  R',
    meta: { latex: 'G,\\ k_B,\\ N_A,\\ R', reads: 'gee / k-B / N-A / R', unit: 'various' },
    description:
      'Frequently used physical constants across mechanics, thermo, and statistical physics.',
    example: `  G ≈ 6.674×10⁻¹¹ N·m²/kg²    gravity
  g ≈ 9.81 m/s²               Earth surface

  k_B ≈ 1.381×10⁻²³ J/K       Boltzmann
  N_A ≈ 6.022×10²³ /mol       Avogadro
  R = N_A k_B ≈ 8.314 J/(mol·K)

  ε₀ ≈ 8.854×10⁻¹² F/m
  μ₀ = 4π×10⁻⁷ N/A²`,
  },
];
