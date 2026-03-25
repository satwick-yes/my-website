import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Settings, Zap, Compass, Link as LinkIcon, AlertTriangle, BookOpen, Layers } from "lucide-react";
import { useEffect } from "react";

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailsModal({ isOpen, onClose }: ProjectDetailsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 lg:p-12"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-6xl max-h-full bg-[#0a0f18]/95 rounded-xl border border-primary/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary/20 bg-primary/5">
              <div className="flex items-center gap-3">
                <FileText className="text-primary" size={28} />
                <h2 className="text-xl md:text-2xl font-bold text-primary tracking-widest uppercase">
                  Research Paper: Dual-Use Electromagnetic Coil
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/20"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-12 overflow-y-auto space-y-16 text-gray-300 leading-relaxed scroll-smooth" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d48b37 #111' }}>
              
              {/* Abstract & Keywords */}
              <section className="space-y-6 bg-white/5 p-8 border border-white/10 rounded-lg shadow-inner">
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Compass className="text-primary" /> Abstract
                </h3>
                <p className="text-lg">
                  This paper presents the design and mathematical modelling of a dual-use electromagnetic coil capable of performing magnetic levitation and resonant wireless power transfer simultaneously using a single guideway coil. The proposed system applies time–frequency multiplexing to combine low-frequency excitation for levitation with high-frequency resonant excitation for wireless charging. Analytical expressions for magnetic flux density, levitation force, inductance, mutual coupling, and resonant power transfer are derived using classical electromagnetic relations. System operation is constrained by thermal limits, electromagnetic safety bounds, and feeder power restrictions to ensure stable and safe performance. Simulation results show stable levitation within the designed air-gap range and wireless power transfer efficiency above 90% at resonance during simultaneous operation. The proposed architecture reduces infrastructure complexity and demonstrates the feasibility of integrating levitation and power transfer in a single electromagnetic structure for future intelligent transportation and dynamic charging systems.
                </p>
                <div className="pt-4 mt-4 border-t border-white/10 flex flex-wrap gap-2">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mr-2 py-1">Keywords:</span>
                  {["Magnetic Levitation", "Wireless Power Transfer", "Mutual Inductance", "Dynamic EV Charging", "Time Division Multiplexing", "Electromagnetic Safety", "Smart Infrastructure", "Resonant coupling", "Time–frequency multiplexing", "Electromagnetic modelling"].map((keyword, i) => (
                    <span key={i} className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-xs text-primary font-medium tracking-wide">
                      {keyword}
                    </span>
                  ))}
                </div>
              </section>

              {/* Introduction */}
              <section className="space-y-6">
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-primary/20 pb-2">
                  <BookOpen className="text-primary" /> I. Introduction
                </h3>
                <p>
                  The rapid growth of electric transportation, intelligent infrastructure, and contactless energy systems has increased the demand for efficient electromagnetic technologies capable of providing both suspension and power transfer without mechanical contact. Magnetic levitation (MagLev) systems eliminate friction between the vehicle and the guideway by generating electromagnetic lifting force, resulting in reduced maintenance, high speed, and improved efficiency [13]–[15]. In parallel, wireless power transfer (WPT) technology enables electric vehicles to receive electrical energy without physical connectors, allowing static and dynamic charging while the vehicle is in motion [1]–[4]. Both magnetic levitation and wireless charging rely on electromagnetic field coupling and inductive energy transfer, making them suitable for integrated implementation in modern transportation platforms [2], [5], [16].
                </p>
                <p>
                  Conventional magnetic levitation systems operate using low-frequency, high-current excitation to produce sufficient lifting force, whereas wireless power transfer systems use high-frequency resonant excitation to achieve efficient energy transmission through magnetic coupling [6], [7], [17]. Because of these different operating conditions, most existing designs employ separate coils, converters, and control circuits for levitation and charging, which increases system complexity, installation cost, and power losses [8], [10], [19]. Recent developments in dynamic wireless charging corridors and resonant inductive coupling have demonstrated high efficiency and improved energy utilization, but these systems are still implemented independently from levitation mechanisms [9], [18], [20].
                </p>
                <p className="text-primary/90 font-medium">
                  To reduce redundancy and improve system efficiency, a unified electromagnetic structure capable of performing both functions is required. In this work, a dual-use embedded coil is proposed to generate levitation force and transfer electrical power simultaneously using the same conductor. The proposed method applies time–frequency multiplexing to combine low-frequency levitation current with high-frequency resonant excitation in a single coil. The system is modelled using electromagnetic relations for magnetic flux density, inductance, mutual coupling, and resonant power transfer, while stability, efficiency, and thermal constraints are included to ensure safe operation [3], [11], [12].
                </p>
                <p>
                  The results demonstrate that a single electromagnetic structure can maintain stable levitation and high-efficiency wireless power transfer simultaneously, providing a compact and scalable solution for future magnetic levitation transportation, intelligent road infrastructure, and dynamic wireless charging systems.
                </p>
              </section>

              {/* Literature Survey */}
              <section className="space-y-6">
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-primary/20 pb-2">
                  <Layers className="text-primary" /> II. Literature Survey
                </h3>
                <p>
                  Wireless power transfer technology for electric vehicle charging has been widely investigated in recent years, particularly for dynamic charging applications where energy is transferred while the vehicle is moving. Inductive and resonant coupling techniques have been analysed in detail, showing that transfer efficiency strongly depends on coil geometry, coupling coefficient, and compensation topology [1], [2], [19]. Several studies have proposed segmented guideway coils, adaptive resonance tuning, and compensation networks to maintain stable power transfer under varying alignment and load conditions [4], [5], [10].
                </p>
                <p>
                  Mathematical modelling of wireless charging systems is typically based on mutual inductance, resonant frequency, and equivalent circuit analysis. Accurate models are required to predict power transfer efficiency, voltage gain, and thermal losses during operation [6], [7], [17]. Recent research has also examined the interaction between dynamic charging infrastructure and the electrical grid, indicating that coordinated design is necessary to avoid feeder overload, voltage instability, and harmonic distortion [9], [16], [20]. Advanced coil structures and compact resonant systems have been proposed to improve efficiency and reduce electromagnetic losses in practical implementations [11], [12].
                </p>
                <p>
                  Magnetic levitation systems use electromagnetic force generated by current-carrying coils to maintain a stable air gap between the vehicle and the guideway. Electromagnetic suspension and electrodynamic suspension technologies have been studied extensively for high-speed transportation and precision positioning applications [13], [14]. These systems require high current at relatively low frequency to produce sufficient lifting force, and stability must be maintained through feedback control and accurate force modeling [15].
                </p>
                <p>
                  In most existing transportation platforms, levitation and wireless charging systems are designed separately, resulting in duplicated coils, increased weight, and higher infrastructure cost. Although extensive research exists on wireless power transfer and magnetic levitation individually, very few studies address the possibility of combining both functions in a single electromagnetic structure. The absence of unified coil architectures motivates the present work, which proposes a dual-use embedded coil capable of performing levitation and resonant power transfer simultaneously using time–frequency multiplexed excitation and electromagnetic superposition. The proposed approach aims to reduce hardware complexity while maintaining stable levitation force, high transfer efficiency, and acceptable thermal performance within practical operating limits.
                </p>
              </section>

              {/* Methodology */}
              <section className="space-y-10">
                <div className="bg-primary/5 -mx-6 md:-mx-12 px-6 md:px-12 py-8 border-y border-primary/20">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                    <Settings className="text-primary" /> III. Methodology
                  </h3>
                  <p className="text-lg">
                    <strong className="text-primary">Overview:</strong> The proposed dual-use embedded coil system performs both magnetic levitation and wireless power transfer using the same electromagnetic structure. The methodology is based on classical electromagnetic relations governing magnetic field generation, levitation force production, inductive coupling, and resonant power transfer. The system operates by combining a low-frequency current component responsible for levitation and a high-frequency component used for wireless energy transfer.
                  </p>
                </div>

                {/* Subsections A-G */}
                <div className="space-y-12">
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-gray-100">A. System Architecture</h4>
                    <p>
                      The proposed system is based on a dual-function electromagnetic guideway coil capable of producing magnetic levitation force while simultaneously transferring electrical power wirelessly to the vehicle. The same excitation coil is utilized for both functions by applying multiplexed electrical signals consisting of a low-frequency component for levitation and a high-frequency component for resonant inductive power transfer.
                    </p>
                    <p>
                      The guideway coil L₁ is connected to a driver circuit that combines a low-frequency voltage source V_LF and a high-frequency inverter source V_HF. The resulting current <em>i(t)</em> flowing through the coil produces a time-varying magnetic field that performs two functions:
                    </p>
                    <ul className="list-disc pl-8 space-y-2 text-primary/80">
                      <li>Generation of electromagnetic force required for levitation</li>
                      <li>Transfer of electrical power through magnetic coupling to the receiver coil</li>
                    </ul>
                    <div className="bg-black/50 p-4 rounded border border-white/5 font-mono text-sm text-green-400">
                      <p>i(t) = i_LF(t) + i_HF(t)</p>
                      <p>i_LF(t) = I_LF sin(ω_LF t)</p>
                      <p>i_HF(t) = I_HF sin(ω_HF t)</p>
                      <p>where ω_HF ≫ ω_LF</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-gray-100">B. Equivalent Circuit Modelling</h4>
                    <p>
                      The electrical behaviour of the proposed system can be represented using an equivalent resonant inductive coupling circuit. The guideway coil and the receiver coil are modelled as coupled inductors with mutual inductance M.
                    </p>
                    <div className="bg-black/50 p-4 rounded border border-white/5 font-mono text-sm text-green-400 space-y-2">
                      <p>V₁ = R₁ I₁ + L₁ (dI₁/dt) + (1/C₁) ∫I₁ dt + M (dI₂/dt)</p>
                      <p>V₂ = R₂ I₂ + L₂ (dI₂/dt) + (1/C₂) ∫I₂ dt + M (dI₁/dt)</p>
                      <p>M = k √(L₁ L₂)</p>
                      <p>ω₀ = 1 / √(L C)</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-gray-100">C. Magnetic Levitation Model</h4>
                    <p>
                      The electromagnetic levitation force generated by the guideway coil is produced due to the interaction between the magnetic field created by the excitation current and the ferromagnetic or permanent magnet structure mounted on the vehicle.
                    </p>
                    <div className="bg-black/50 p-4 rounded border border-white/5 font-mono text-sm text-green-400 space-y-2">
                      <p>B ≈ (μ₀ N I) / g</p>
                      <p>F = (B² A) / (2μ₀) = (μ₀ N² I² A) / (2g²)</p>
                      <p>F = mg (Force balance condition)</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-gray-100">D. Wireless Power Transfer Model</h4>
                    <p>
                      Wireless power transfer in the proposed system is achieved using resonant inductive coupling between the guideway coil and the receiver coil mounted on the vehicle.
                    </p>
                    <div className="bg-black/50 p-4 rounded border border-white/5 font-mono text-sm text-green-400 space-y-2">
                      <p>V₂ = M (dI₁/dt)</p>
                      <p>P_L = I₂² R_L</p>
                      <p>η = P_L / P_in</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-gray-100">E. Multiplexed Excitation Model</h4>
                    <p>
                      The main contribution of the proposed system is the use of multiplexed excitation to allow a single guideway coil to simultaneously perform magnetic levitation and wireless power transfer.
                    </p>
                    <div className="bg-black/50 p-4 rounded border border-white/5 font-mono text-sm text-green-400 space-y-2">
                      <p>B(t) = B_LF(t) + B_HF(t)</p>
                      <p>F ∝ I_LF²</p>
                      <p>P ∝ I_HF²</p>
                    </div>
                    <p>
                      This separation in frequency domain allows independent control of levitation force and transferred power using a single electromagnetic coil.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-gray-100">F. Loss and Thermal Constraints</h4>
                    <p>
                      The proposed dual-function electromagnetic system carries both low-frequency and high-frequency currents simultaneously, increasing copper loss, core loss, and thermal stress.
                    </p>
                    <div className="bg-black/50 p-4 rounded border border-white/5 font-mono text-sm text-green-400 space-y-2">
                      <p>I_rms = √(I_LF² + I_HF²)</p>
                      <p>R_ac = R_dc (1 + k_s √f)</p>
                      <p>P_cu = I_LF² R_dc + I_HF² R_ac</p>
                      <p>P_loss = P_cu + P_core</p>
                      <p>ΔT = P_loss / (h A_s) ≤ ΔT_max</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-gray-100">G. Optimization Formulation</h4>
                    <p>
                      The objective of the proposed design is to maximize levitation force and transferred power while minimizing losses.
                    </p>
                    <div className="bg-black/50 p-4 rounded border border-white/5 font-mono text-sm text-green-400 space-y-2">
                      <p>Maximize J = w₁F + w₂P_L - w₃P_loss</p>
                      <p>Subject to: F ≥ mg, η ≥ η_min, ΔT ≤ ΔT_max, I_rms ≤ I_max, P_in ≤ P_grid</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Results and Discussion */}
              <section className="space-y-6">
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-primary/20 pb-2">
                  <Zap className="text-primary" /> IV. Results and Discussion
                </h3>
                <p>
                  The proposed dual-function electromagnetic coil system was analysed using the mathematical models developed in Section III. Simulation results were obtained to validate the levitation model, resonant wireless power transfer model, multiplexed excitation principle, and thermal constraints. The results confirm that a single guideway coil can simultaneously generate sufficient levitation force and transfer electrical power efficiently using time–frequency multiplexed excitation.
                </p>
                <ul className="list-disc pl-6 space-y-3 text-gray-400">
                  <li><strong>Magnetic Flux Density:</strong> Decreases nonlinearly as the air gap increases, following theoretical relation.</li>
                  <li><strong>Levitation Force:</strong> Decreases rapidly with increasing gap, matching inverse-square relationship.</li>
                  <li><strong>Resonant Frequency Response:</strong> A sharp peak is observed near resonant frequency enabling maximum power transfer.</li>
                  <li><strong>Wireless Power Transfer Efficiency:</strong> Increases rapidly with coupling coefficient and approaches unity for strong coupling conditions.</li>
                  <li><strong>Multiplexed Excitation Waveform:</strong> Current is composed of low-freq levitation and high-freq power transfer components coexisting without interference.</li>
                  <li><strong>Copper Loss:</strong> Increases quadratically with RMS current, validating importance of selected current limits.</li>
                </ul>
                <div className="p-4 bg-primary/10 border-l-4 border-primary text-primary/90 mt-6">
                  <p className="font-medium">
                    The feasibility of the proposed system is validated through mathematical modelling and simulation results. The obtained characteristics confirm that a single guideway coil can achieve simultaneous magnetic levitation and wireless power transfer with stable force, high efficiency, and acceptable thermal limits.
                  </p>
                </div>
              </section>

              {/* Patent Images Gallery */}
              <section className="space-y-6">
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-primary/20 pb-2">
                  <Layers className="text-primary" /> Appendix: System Diagrams & Patent Figures
                </h3>
                <p className="text-gray-400">
                  The following visualizations illustrate the mathematical modeling, equivalent circuits, and structural design concepts developed for the dual-mode electromagnetic coil.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {[...Array(11)].map((_, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/40 hover:border-primary/50 transition-colors shadow-lg">
                      <div className="aspect-[4/3] bg-white/5 flex items-center justify-center p-4">
                        <img 
                          src={`/patent (${i + 1}).png`} 
                          alt={`Patent Figure ${i + 1}`} 
                          className="max-w-full max-h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pb-2 pt-12 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <p className="text-primary text-sm font-bold tracking-widest uppercase">Figure {i + 1}</p>
                      </div>
                    </div>
                  ))}
                  <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/40 hover:border-primary/50 transition-colors shadow-lg">
                    <div className="aspect-[4/3] bg-white/5 flex items-center justify-center p-4">
                      <img 
                        src={`/patent idea.png`} 
                        alt={`Patent Idea Concept`} 
                        className="max-w-full max-h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pb-2 pt-12 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <p className="text-primary text-sm font-bold tracking-widest uppercase">Concept Details</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Conclusion */}
              <section className="space-y-6 bg-gradient-to-r from-primary/10 to-transparent p-8 rounded-lg border border-primary/20">
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider">V. Conclusion</h3>
                <p className="text-lg">
                  This paper presented a mathematical and simulation-based analysis of a dual-use electromagnetic coil capable of performing magnetic levitation and wireless power transfer simultaneously using multiplexed excitation. The developed models for levitation force, resonant inductive coupling, efficiency, and thermal constraints were validated through simulation results. The results confirmed that the proposed single-coil architecture can generate sufficient levitation force while maintaining efficient power transfer at resonance without exceeding thermal limits. The proposed approach reduces system complexity compared to conventional dual-coil designs and provides a feasible solution for compact electromagnetic transportation and dynamic wireless charging applications. Future work may include experimental validation and hardware implementation of the proposed system.
                </p>
              </section>

              {/* References */}
              <section className="space-y-6 border-t border-white/10 pt-8 mt-12">
                <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <LinkIcon size={20} /> References
                </h3>
                <ul className="space-y-3 text-sm text-gray-500 font-mono list-none pl-0">
                  <li>[1] S. Li and C. C. Mi, "Wireless power transfer for electric vehicle applications," IEEE Journal of Emerging and Selected Topics in Power Electronics, vol. 3, no. 1, pp. 4–17, 2015.</li>
                  <li>[2] G. A. Covic and J. T. Boys, "Inductive power transfer," Proceedings of the IEEE, vol. 101, no. 6, pp. 1276–1289, 2013.</li>
                  <li>[3] C. T. Rim and C. Mi, Wireless Power Transfer for Electric Vehicles and Mobile Devices, Wiley, 2017.</li>
                  <li>[4] A. Triviño et al., "Wireless power transfer technologies applied to electric vehicles: A review," Energies, vol. 14, no. 6, 2021.</li>
                  <li>[5] A. A. S. Mohamed et al., "An overview of dynamic inductive charging for electric vehicles," Energies, vol. 15, no. 15, 2022.</li>
                  <li>[6] Z. Pantic et al., "ZCS LCC-compensated resonant inverter for inductive power transfer application," IEEE Transactions on Industrial Electronics, vol. 58, 2011.</li>
                  <li>[7] J. M. Miller et al., "Primary-side power flow control of wireless power transfer for electric vehicle charging," IEEE Journal of Emerging and Selected Topics in Power Electronics, vol. 3, 2015.</li>
                  <li>[8] S. Lukic and Z. Pantic, "Cutting the cord: Static and dynamic inductive wireless charging of electric vehicles," IEEE Electrification Magazine, vol. 1, 2013.</li>
                  <li>[9] X. Guo et al., "Development of wireless charging technology for electric vehicles," Highlights in Science, Engineering and Technology, 2023.</li>
                  <li>[10] A. Mahesh et al., "Inductive wireless power transfer charging for electric vehicles – A review," IEEE Access, vol. 9, 2021.</li>
                  <li className="pt-2 italic">Note: References 11-20 are available in the full document.</li>
                </ul>
              </section>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-primary/20 bg-[#060a12] text-center">
              <button
                onClick={onClose}
                className="px-8 py-2 bg-primary/20 hover:bg-primary/40 text-primary hover:text-white font-bold tracking-widest uppercase transition-colors rounded border border-primary/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
