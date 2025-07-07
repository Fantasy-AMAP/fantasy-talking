[English](./tips.m)

# FantasyTalking 使用指南

我们收到了大量用户与研究者的反馈，指出社区版 FantasyTalking ComfyUI 工作流在以下几方面与官方实现存在差异，导致体验下降：  

1. 口型同步不准确
- 参考 [Issue#54](https://github.com/Fantasy-AMAP/fantasy-talking/issues/54#issuecomment-2890198393)。  
- 根本原因：ComfyUI 额外引入了 “音频 CFG 调度” 机制，默认仅在前 10% 的去噪步骤启用音频条件；而官方实现则在全部去噪步骤持续施加音频 CFG，从而保证精确的音视频对齐。
- 建议：在「音频 CFG Schedule」节点中将 end_percent 设置为 0.7 及以上，（论文实现为 1.0），以延长音频条件的施加区间并显著改善口型同步。

2. 首帧颜色偏差和模糊
- 参考 [Issue#194](https://github.com/kijai/ComfyUI-WanVideoWrapper/issues/194)
- 该问题是当前视频扩散/合成模型的常见现象，首帧可能出现色彩漂移或失焦，需要在后处理或模型配置上进行针对性优化。

3. 长视频生成的可控性与一致性不足
- 长序列往往伴随运动漂移、人物细节变化等问题，需要结合分段生成、关键帧锁定或循环一致性约束等策略。

## 快速配置

- 核心参数解释：
	- end_percent（Audio CFG Schedule）：控制音频条件作用的去噪步数比例，官方推荐 >= 0.7。
	- 其余重要超参数（采样步数、分辨率、CFG scale 等）与通用视频扩散设置一致，可按照官方文档/案例进行微调。
- 常见问题排查：
	- 口型不同步 → 检查 Audio CFG Schedule 是否启用、end_percent 数值是否正确。
	- 首帧模糊 → 尝试增加「Frame Interpolation」或「Deblur」后处理节点，或缩短初始噪声强度。
	- 长视频漂移 → 采用分段生成并在关键帧间插值，或使用官方提供的长视频一致性脚本。
- 推荐设置：
	- end_percent ≥ 0.7（强烈推荐）
  -	采样步数 ≥ 30，分辨率与目标输出一致
  -	合理调整 CFG scale（一般 3.0-7.0）平衡保真度与创造性

按照上述配置，可在社区版 ComfyUI 环境中获得更接近官方实现的音视频同步和画面质量。如有进一步问题，请在对应 Issue 下留言或联系我们，我们将及时跟进支持。


## 社区版 FantasyTalking ComfyUI 工作流详细使用指南

### 1. 推荐设置:
- **ComfyUI 工作流**: 在 FantasyTalking ComfyUI 工作流中，建议设置音频 CFG Schedule 节点中的 `end_percent` >= 0.7
  - 该参数决定了音频条件在前多少步骤施加影响，原始工作流默认为设置为 0.1，即只有很少步骤使用了 FantasyTalking，嘴型可能无法正确匹配。

- **个性化控制**: 您可以通过提示控制角色的动作、行为、情绪，通过 `prompt_cfg_scale` 和 `audio_cfg_scale` 控制提示和音频对生成视频的影响程度 (ComfyUI 也包含这两个参数)。
  - 你可以自由的调试提示和音频的 CFG 设置，如通过调高音频 CFG 获得更一致的口型同步，提示和音频 CFG 的推荐范围是 `3.0-7.0`。

### 2. FantasyTalking Worklflow 关键节点参数解释:
WanVideo CFG Schedule Float List:

<img src="assets/audio_cfg_node.png" alt="Example"  width="400" height="200" />

* `cfg_scale_start`, `cfg_scale_end`, `interpolation`: 决定音频 CFG 的缩放的范围。
* `start_percent`, `end_percent`: 决定了音频 CFG 作用的去噪步骤。

最终生成一个浮点数列表，为每一个去噪步骤分别设置对应的音频 CFG，超出设定范围时音频 CFG 设置为 1.0。

### 3. 常见问题与解法

#### 3.1. 口型同步问题

社区工作流默认只有前 10% 的去噪步骤使用音频 CFG = 5，这限制了 FantasyTalking 对生成过程的影响，导致口型同步不准确，而我们官方的实现为`全步骤应用音频 CFG = 4.5`，能实现准确的音视频口型同步结果。

**🔥解决方案**：通过设置较大的 end_percent 的值，让 FantasyTalking 的音频 CFG 应用于更大的去噪范围，能显著提升口型同步结果。

#### 3.2. 首帧颜色偏差和模糊
生成的视频有时第一帧会有色变以及模糊，这是由于目前 FantasyTalking 基于 I2V 的视频生成模型进行训练，首帧的问题在原始 I2V 基模就有，可能来源于分辨率、第一帧色域、CFG 等等，参考[Issue#194](https://github.com/kijai/ComfyUI-WanVideoWrapper/issues/194)。FantasyTalking 的音频条件训练，一定程度上降低了原始模型的首帧参考能力，增加了该问题的出现概率。

**🔥解决方案**：通过降低 FantasyTalking 的影响权重、步数，能减少首帧问题的出现。比如减少音频 CFG 影响的去噪步骤数量（设置 `end_percent = 0.7`)，以及降低音频 CFG 等。这是为了确保我们的模型影响不要太重，权重降低，更倾向于基础模型的第一帧参考条件，但可能对唇同步不准确。

**实验对比**  

通过简单的设置音频 CFG Schedule 节点中的 `end_percent` 的范围，可以达到显著不同的实现结果：

<table>
  <tr>
    <td>end_percent</td>
    <td>生成视频效果</td>
    <td>效果描述</td>
  </tr>
  <tr>
    <td>0.1</td>
    <td>
      <video style="width: 220px; height: auto;" src="https://github.com/user-attachments/assets/e5dbd0b9-7c18-4627-aa16-881e513d16a4" type="video/mp4">
        您的浏览器不支持视频标签。
      </video>
    </td>
    <td>音唇同步效果差</td>
      </tr>
  <tr>
    <td>0.4</td>
    <td>
      <video style="width: 220px; height: auto;" src="https://github.com/user-attachments/assets/e80c328b-d1d2-43f9-bad8-665ac78dfb40" type="video/mp4">
        您的浏览器不支持视频标签。
      </video>
    </td>
    <td>音唇同步效果较好</td>
  </tr>
  <tr>
    <td>0.7</td>
    <td>
      <video style="width: 220px; height: auto;" src="https://github.com/user-attachments/assets/c44a8499-93d2-4038-b72e-9174b5652aa0" type="video/mp4">
        您的浏览器不支持视频标签。
      </video>
    </td>
    <td>音唇同步效果非常好</td>
  </tr>
  <tr>
    <td>1.0</td>
    <td>
      <video style="width: 220px; height: auto;" src="https://github.com/user-attachments/assets/0f100d85-1b78-4ea1-958a-7634fcce5888" type="video/mp4">
        您的浏览器不支持视频标签。
      </video>
    </td>
    <td>首帧可能存在色变和模糊</td>
  </tr>
</table>

#### 3.3. 音频驱动的长视频生成

目前 Wan2.1 的长视频生成技术仍面临准确度、一致性等问题，参考[Issue#87](https://github.com/kijai/ComfyUI-WanVideoWrapper/issues/87), [Issue#166](https://github.com/kijai/ComfyUI-WanVideoWrapper/issues/166)。目前可以通过：
- 首尾帧拼接
- 滑动上下文窗口生成的方式进行长视频生成

我们推荐使用上下文窗口的方式，逐段进行去噪生成，并在重合的窗口内执行 latents 特征的融合，参考 kijai 的[长视频生成工作流](https://github.com/kijai/ComfyUI-WanVideoWrapper/blob/main/example_workflows/wanvideo_long_T2V_example_01.json)实现。
