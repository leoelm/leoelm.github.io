# Bred to Break: What a 1970 Corn Blight Teaches Us About Distilled LLMs

![Diagram of four models distilled from DeepSeek whose weak spots drift together until a single attack breaks all of them](figures/lead_figure.png "Qwen, Claude and NVIDIA models are distilled on DeepSeek. Each solid blob is where a model behaves safely, and each dashed pocket is a weak spot an attack can hit. Before distillation every model has its own weak spot, so breaking the whole pool takes four separate attacks. The more the students learn from the teacher, the closer their weak spots move, until a single attack breaks them all.")

By 1970, most of US corn production relied on a single shared trait, a type of cytoplasm known as “Texas male-sterile,” which made seed production cheaper. While there was plenty of genetic variety across the different corn hybrids, nearly all of them shared this same cytoplasm, and with it the same weakness. In 1970, a new strain of a disease named Southern corn leaf blight (SCLB), which targeted exactly this cytoplasm, swept across the country. The epidemic ruined around 25% of the national corn yield, making SCLB one of the economically worst crop diseases of the 20th century [1]. The solution was simple: diversification. Moving away from the shared cytoplasm made seed production more involved, but drastically reduced the chance of costly, widespread events like this one. 

## A monoculture of models

But what does corn really have to do with artificial intelligence and large language models? Well, today’s LLMs have also converged towards a monoculture [2, 3], using similar architectures, relying on largely overlapping training corpora, and, at their most extreme, directly learning from one another through distillation [4]. On the surface this seems good, since highly capable models can be trained efficiently, with learnings from one transferring to another. So just like corn in the 1970s, modern AI has found its own cheap seed production, which comes with all its upsides, but also all its drawbacks. Because just like the corn hybrids, models that look different on the surface can share the same weakness underneath, inherited from a common source [5, 6]. This makes pools of models with shared properties easier to break as a group: it takes fewer distinct attacks to compromise most of the pool, even when each model looks harder to attack on its own. 

## Robustness, one model at a time

While we do have metrics to measure the effectiveness of attacks and the robustness of models, they tend to look at models and attacks as individual units rather than as a group. For instance, attack success rate [7] measures how often an attack method manages to break a single, fixed model across a set of inputs. Transferability [8–10], on the other hand, takes an attack crafted on one model and checks how well it works on other models. Both give valuable insights, but neither captures how vulnerabilities are shared across a pool of models, and therefore how the pool behaves when attacked simultaneously. 

![Animation splitting each model's attack success rate into shared and unique weaknesses, followed by real measurements of systemic robustness before and after distillation](figures/systemic_robustness_dark.mp4 "Attack success rate scores each model on its own. Split each bar into weaknesses all models share, weaknesses shared with one other model, and weaknesses unique to that model, and much of the damage turns out to come from the same few attacks.")

For example, take two separate pools of four LLMs each, where every model is breakable on its own. In the first pool, a single attack compromises all four models. In the second pool, each model needs its own attack, so four separate attacks are required. Attack success rate can’t tell them apart, and transferability only tells us how far a single attack reaches, not how many we need to cover the rest. Yet the two pools clearly exhibit very different robustness patterns. The reality often sits in between these two extremes, where some attacks break a few models and others just one. This raises a new question: how many distinct attacks are needed to compromise most of a pool of models? 

## Systemic adversarial robustness

To answer this question, we introduce Systemic Adversarial Robustness (SAR): the fewest distinct attacks needed to compromise a chosen share of a model pool (say, 90% of its models), divided by the size of the pool. In other words, SAR measures how diverse attacks need to be to break a pool of models. In our toy example, the first pool has a SAR of 1/4, while the second has a SAR of 4/4. A low SAR means a handful of attacks go a long way, much like the shared cytoplasm in 1970s corn. A high SAR means vulnerabilities are spread out, and each model needs its own attack. 

To make this precise, take a pool of $M$ models $f_1, \dots, f_M$ and a single harmful request $x$. An attacker can try many altered versions of that request, for instance by appending different adversarial suffixes, and we call this set of candidates $T_x$. Each candidate $x' \in T_x$ breaks some part of the pool, namely the models whose response falls outside the set of safe responses $S_y$, which we write as $C(x') = \{\, j : f_j(x') \notin S_y \,\}$. SAR then asks for the smallest collection of candidates $V$ that, together, break at least a $1 - \delta$ share of the pool:

$$
\mathrm{SAR}_{1-\delta} = \frac{1}{M} \min_{V \subseteq T_x} \left\{ |V| \;:\; \frac{1}{M} \Big| \bigcup_{x' \in V} C(x') \Big| \geq 1 - \delta \right\}
$$

Here $\delta$ is the share of the pool we allow to stay unbroken: $\delta = 0$ demands that every model fails, and $\delta = 0.1$ is the 90% from above. With $\delta = 0$, the toy pools give exactly the $1/4$ and $4/4$ from before. Finding this minimum exactly is a partial set cover problem [11], which is NP-hard, so in practice we estimate it greedily: find a candidate that breaks as many of the remaining models as possible, set those models aside, and repeat until enough of the pool has fallen, as in the classic greedy algorithm for set cover [12]. If this takes $\hat{k}$ candidates, our estimate is $\hat{k}/M$. Since the greedy search can only use more candidates than necessary, never fewer, the estimate is an upper bound on the true SAR. We compute it separately for every harmful request, drawn from HarmBench [13], so the figures below show how SAR is distributed across many requests.

![Charts showing systemic robustness falling faster and further than individual robustness while a pool of small models is distilled on DeepSeek-R1 traces](figures/sar_over_finetuning_llm.png "Ten small models learning from DeepSeek-R1. Left: the students get better at imitating R1 (dotted line), while each one becomes only slightly easier to attack on its own (orange). Systemic robustness (red) falls much faster. Right: systemic robustness for each harmful request at several points in training, against the starting pool in blue.")

## A shared teacher, a shared weakness

To show that systemic robustness captures something commonly used metrics miss, we distil a pool of ten small large language models from a single, shared teacher model, DeepSeek-R1 [14]. To attack the pool, we seed adversarial suffixes with AmpleGCG [15] and refine them against all remaining models at once with BEAST [16]. We see that not only does SAR show signs of decreased robustness sooner than attack success rate, but its effects are also far more pronounced (Figure 3): after distillation, SAR has dropped by 15%, while individual robustness has dropped by just over 5%. Figure 3 helps establish SAR as a more responsive metric for capturing robustness changes in model pools. In other words, giving every model the same teacher is like giving every corn hybrid the same cytoplasm: each plant may look just as healthy, but a single disease can now ruin far more of the yield. 

## Larger models, stronger teachers

The same pattern is further underlined when looking at LLMs with a higher parameter number and more sophisticated teachers. We take a pool of five Qwen models and one Llama model ranging from 1.5B to 32B parameters. In addition, we look at a second pool of eight models from a more diverse set of five different model providers ranging from 4B to 32B parameters. The specific fine-tuning regime for these models is distillation, first on thinking traces produced by Deepseek-R1 and then further distillation on Opus 4.6 traces. In both instances, we can see that the distilled variants of models are less robust than the original models (Figure 4) with the trend becoming more pronounced after the second distillation step. Interestingly, the 6x6 and 8x8 pools behave in somewhat opposite ways. At its worst, in the 6x6 pool we only see a ~6% drop in mean systemic robustness after fine-tuning on R1 traces followed by another 40% drop after Opus 4.6 distillation. In contrast, in the 8x8 pool the mean systemic robustness drops by around 30% after R1 fine-tuning, and then drops by only another ~6% after Opus 4.6 distillation. It is also noteworthy that the impact of distillation becomes less pronounced for increasing values of $\delta$ in both pools, which can be primarily attributed to the fact that the undistilled pool is already not particularly robust to begin with.

![Ridge plots of systemic robustness per request for a six-model and an eight-model pool, before and after distillation](figures/kde_off_amplegcg_beast_ridges-1.png "Systemic robustness for every harmful request, for the six-model pool (left) and the eight-model pool (right): the original models in grey, after fine-tuning on DeepSeek-R1 in blue, and after further fine-tuning on Claude Opus 4.6 outputs in orange.")

## Diversifying the seed

Following the blight, seed producers moved away from the shared cytoplasm and diversified their crop, which made seed production more involved but greatly reduced the risk of a single disease ruining a large share of the yield. Today, distillation is our cheap seed production, and SAR gives us a way to measure what it might cost. So, just like US corn growers in the 1970s, we should ask ourselves: are our seeds diverse enough, or are we accepting the risk of losing a large share of our harvest?

---

For the full set of results, ablations, and analysis, see our [arXiv preprint](https://arxiv.org/abs/2610.27353).

### Acknowledgements

LE, MW and LS acknowledge the support of the UKRI Prosperity Partnership Scheme (FAIR) under
EPSRC Grant EP/V056883/1. <span class="paper-ink">We thank Dr. Lichtenecker for editorial assistance.</span>

### References

[1] Smith, P., & Shike, J. (2020, November 15). When the corn died: How a disease changed an industry. *AgWeb*. <https://www.agweb.com/news/crops/crop-production/when-corn-died>

[2] Kleinberg, J., & Raghavan, M. (2021). Algorithmic monoculture and social welfare. *Proceedings of the National Academy of Sciences, 118*(22), Article e2018340118. <https://doi.org/10.1073/pnas.2018340118>

[3] Toups, C., Bommasani, R., Creel, K., Bana, S., Jurafsky, D., & Liang, P. (2023). Ecosystem-level analysis of deployed machine learning reveals homogeneous outcomes. *Advances in Neural Information Processing Systems, 36*, 51178–51201.

[4] Xu, X., Li, M., Tao, C., Shen, T., Cheng, R., Li, J., Xu, C., Tao, D., & Zhou, T. (2024). *A survey on knowledge distillation of large language models* (arXiv:2402.13116). arXiv. <https://doi.org/10.48550/arXiv.2402.13116>

[5] Cloud, A., Le, M., Chua, J., Betley, J., Sztyber-Betley, A., Hilton, J., Marks, S., & Evans, O. (2025). *Subliminal learning: Language models transmit behavioral traits via hidden signals in data* (arXiv:2507.14805). arXiv. <https://doi.org/10.48550/arXiv.2507.14805>

[6] Kim, E., Garg, A., Peng, K., & Garg, N. (2025). *Correlated errors in large language models* (arXiv:2506.07962). arXiv. <https://doi.org/10.48550/arXiv.2506.07962>

[7] Carlini, N., & Wagner, D. (2017). Towards evaluating the robustness of neural networks. In *2017 IEEE Symposium on Security and Privacy* (pp. 39–57). IEEE. <https://doi.org/10.1109/SP.2017.49>

[8] Papernot, N., McDaniel, P., & Goodfellow, I. (2016). *Transferability in machine learning: From phenomena to black-box attacks using adversarial samples* (arXiv:1605.07277). arXiv. <https://doi.org/10.48550/arXiv.1605.07277>

[9] Szegedy, C., Zaremba, W., Sutskever, I., Bruna, J., Erhan, D., Goodfellow, I., & Fergus, R. (2014). Intriguing properties of neural networks. In *International Conference on Learning Representations*. <https://arxiv.org/abs/1312.6199>

[10] Zou, A., Wang, Z., Carlini, N., Nasr, M., Kolter, J. Z., & Fredrikson, M. (2023). *Universal and transferable adversarial attacks on aligned language models* (arXiv:2307.15043). arXiv. <https://doi.org/10.48550/arXiv.2307.15043>

[11] Slavík, P. (1997). Improved performance of the greedy algorithm for partial cover. *Information Processing Letters, 64*(5), 251–254.

[12] Chvátal, V. (1979). A greedy heuristic for the set-covering problem. *Mathematics of Operations Research, 4*(3), 233–235. <https://doi.org/10.1287/moor.4.3.233>

[13] Mazeika, M., Phan, L., Yin, X., Zou, A., Wang, Z., Mu, N., Sakhaee, E., Li, N., Basart, S., Li, B., Forsyth, D., & Hendrycks, D. (2024). *HarmBench: A standardized evaluation framework for automated red teaming and robust refusal* (arXiv:2402.04249). arXiv. <https://doi.org/10.48550/arXiv.2402.04249>

[14] DeepSeek-AI. (2025). *DeepSeek-R1: Incentivizing reasoning capability in LLMs via reinforcement learning* (arXiv:2501.12948). arXiv. <https://doi.org/10.48550/arXiv.2501.12948>

[15] Liao, Z., & Sun, H. (2024). *AmpleGCG: Learning a universal and transferable generative model of adversarial suffixes for jailbreaking both open and closed LLMs* (arXiv:2404.07921). arXiv. <https://doi.org/10.48550/arXiv.2404.07921>

[16] Sadasivan, V. S., Saha, S., Sriramanan, G., Kattakinda, P., Chegini, A., & Feizi, S. (2024). *Fast adversarial attacks on language models in one GPU minute* (arXiv:2402.15570). arXiv. <https://doi.org/10.48550/arXiv.2402.15570>
