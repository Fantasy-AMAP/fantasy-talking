# FantasyTalking: Realistic Talking Portrait Generation via Coherent Motion Synthesis

[![Home Page](https://img.shields.io/badge/Project-<Website>-blue.svg)](https://fantasy-amap.github.io/fantasy-talking/) 
[![arXiv](https://img.shields.io/badge/Arxiv-2504.04842-b31b1b.svg?logo=arXiv)](https://arxiv.org/abs/2504.04842) 

## Abstract

> Creating a realistic animatable avatar from a single static portrait remains challenging. Existing approaches often struggle to capture subtle facial expressions, the associated global body movements, and the dynamic background. To address these limitations, we propose a novel framework that leverages a pretrained video diffusion transformer model to generate high-fidelity, coherent talking portraits with controllable motion dynamics. At the core of our work is a dual-stage audio-visual alignment strategy. In the first stage, we employ a clip-level training scheme to establish coherent global motion by aligning audio-driven dynamics across the entire scene, including the reference portrait, contextual objects, and background. In the second stage, we refine lip movements at the frame level using a lip-tracing mask, ensuring precise synchronization with audio signals. To preserve identity without compromising motion flexibility, we replace the commonly used reference network with a facial-focused cross-attention module that effectively maintains facial consistency throughout the video. Furthermore, we integrate a motion intensity modulation module that explicitly controls expression and body motion intensity, enabling controllable manipulation of portrait movements beyond mere lip motion. Extensive experimental results show that our proposed approach achieves higher quality with better realism, coherence, motion intensity, and identity preservation.


![Fig.1](https://github.com/Fantasy-AMAP/fantasy-talking/blob/main/assert/fig0_1_0.png)

## Code

Ours model and code will be open sourced before August.

## Citation
```
@misc{wang2025fantasytalkingrealistictalkingportrait,
      title={FantasyTalking: Realistic Talking Portrait Generation via Coherent Motion Synthesis}, 
      author={Mengchao Wang and Qiang Wang and Fan Jiang and Yaqi Fan and Yunpeng Zhang and Yonggang Qi and Kun Zhao and Mu Xu},
      year={2025},
      eprint={2504.04842},
      archivePrefix={arXiv},
      primaryClass={cs.CV},
      url={https://arxiv.org/abs/2504.04842}, 
}
```
