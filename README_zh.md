[中文阅读](./README_zh.md)
# FantasyTalking : Realistic Talking Portrait Generation via Coherent Motion Synthesis

[![Home Page](https://img.shields.io/badge/Project-FantasyTalking-blue.svg)](https://fantasy-amap.github.io/fantasy-talking/)
[![arXiv](https://img.shields.io/badge/Arxiv-2504.04842-b31b1b.svg?logo=arXiv)](https://arxiv.org/abs/2504.04842)
[![hf_paper](https://img.shields.io/badge/🤗-FantasyTalking-red.svg)](https://huggingface.co/acvlab/FantasyTalking)

## 🔥 Latest News!!
* 2025年7月7日: 发布了[使用指南](./docs/tips_zh.md)，用于解决近期研究者和社区反馈的常见问题。
* 2025年7月5日: 我们的工作被 ACM MM 2025 接收!
* 2025年4月29日: 我们的工作被加入到[ComfyUI-Wan](https://github.com/kijai/ComfyUI-WanVideoWrapper) ! 感谢 [kijai](https://github.com/kijai) 更新 👏!
* 2025年4月28日: 开源了音频条件下的推理代码和模型权重。


## 快速开始
### 🛠️安装和依赖

首先克隆git仓库：

```
git clone https://github.com/Fantasy-AMAP/fantasy-talking.git
cd fantasy-talking
```

安装依赖：
```
# Ensure torch >= 2.0.0
pip install -r requirements.txt
# 可选安装 flash_attn 以加速注意力计算
pip install flash_attn
```

### 🧱模型下载
| 模型        |                       下载链接                                          |    备注                      |
| --------------|-------------------------------------------------------------------------------|-------------------------------|
| Wan2.1-I2V-14B-720P  |      🤗 [Huggingface](https://huggingface.co/Wan-AI/Wan2.1-I2V-14B-720P)    🤖 [ModelScope](https://www.modelscope.cn/models/Wan-AI/Wan2.1-I2V-14B-720P)     | 基础模型
| Wav2Vec |      🤗 [Huggingface](https://huggingface.co/facebook/wav2vec2-base-960h)    🤖 [ModelScope](https://modelscope.cn/models/AI-ModelScope/wav2vec2-base-960h)      | 音频编码器
| FantasyTalking model      |      🤗 [Huggingface](https://huggingface.co/acvlab/FantasyTalking/)     🤖 [ModelScope](https://www.modelscope.cn/models/amap_cvlab/FantasyTalking/)         | 我们的音频条件权重

使用huggingface-cli下载模型：
``` sh
pip install "huggingface_hub[cli]"
huggingface-cli download Wan-AI/Wan2.1-I2V-14B-720P --local-dir ./models/Wan2.1-I2V-14B-720P
huggingface-cli download facebook/wav2vec2-base-960h --local-dir ./models/wav2vec2-base-960h
huggingface-cli download acvlab/FantasyTalking fantasytalking_model.ckpt --local-dir ./models
```

使用modelscope-cli下载模型：
``` sh
pip install modelscope
modelscope download Wan-AI/Wan2.1-I2V-14B-720P --local_dir ./models/Wan2.1-I2V-14B-720P
modelscope download AI-ModelScope/wav2vec2-base-960h --local_dir ./models/wav2vec2-base-960h
modelscope download amap_cvlab/FantasyTalking   fantasytalking_model.ckpt  --local_dir ./models
```

### 🔑 推理
``` sh
python infer.py  --image_path ./assets/images/woman.png --audio_path ./assets/audios/woman.wav
```
您可以通过提示控制角色的行为。**提示和音频cfg的推荐范围是[3-7]。你可以通过调高音频cfg获得更一致的口型同步。**
``` sh
python infer.py  --image_path ./assets/images/woman.png --audio_path ./assets/audios/woman.wav --prompt "The person is speaking enthusiastically, with their hands continuously waving." --prompt_cfg_scale 5.0 --audio_cfg_scale 5.0
```

我们在此处提供了一个详细的表格。该模型在单个A100上进行了测试。(512x512，81帧)
|`torch_dtype`|`num_persistent_param_in_dit`|Speed|Required VRAM|
|-|-|-|-|
|torch.bfloat16|None (unlimited)|15.5s/it|40G|
|torch.bfloat16|7*10**9 (7B)|32.8s/it|20G|
|torch.bfloat16|0|42.6s/it|5G|

### Gradio 示例
我们构建了一个Huggingface[在线演示](https://huggingface.co/spaces/acvlab/FantasyTalking)。

对于本地的gradio演示，您可以运行：
``` sh
pip install gradio spaces
python app.py
```

## 🧩 社区工作
我们❤️喜欢来自开源社区的贡献！如果你的工作改进了FantasyTalking，请告诉我们。

## 🔗Citation
如果您发现此存储库有用，请考虑给出一个星号⭐和引用：
```
@article{wang2025fantasytalking,
   title={FantasyTalking: Realistic Talking Portrait Generation via Coherent Motion Synthesis},
   author={Wang, Mengchao and Wang, Qiang and Jiang, Fan and Fan, Yaqi and Zhang, Yunpeng and Qi, Yonggang and Zhao, Kun and Xu, Mu},
   journal={arXiv preprint arXiv:2504.04842},
   year={2025}
 }
```

## 致谢
感谢[Wan2.1](https://github.com/Wan-Video/Wan2.1)、[HunyuanVideo](https://github.com/Tencent/HunyuanVideo)和[DiffSynth-Studio](https://github.com/modelscope/DiffSynth-Studio)开源他们的模型和代码，为该项目提供了宝贵的参考和支持。他们对开源社区的贡献真正值得赞赏。
