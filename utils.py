# Copyright Alibaba Inc. All Rights Reserved.

import imageio
import librosa
import numpy as np
import torch
from PIL import Image
from tqdm import tqdm


def resize_image_by_longest_edge(image_path, target_size):
    image = Image.open(image_path).convert("RGB")
    width, height = image.size
    scale = target_size / max(width, height)
    new_size = (int(width * scale), int(height * scale))
    return image.resize(new_size, Image.LANCZOS)


def save_video(frames, save_path, fps, quality=9, ffmpeg_params=None):
    writer = imageio.get_writer(
        save_path, fps=fps, quality=quality, ffmpeg_params=ffmpeg_params
    )
    for frame in tqdm(frames, desc="Saving video"):
        frame = np.array(frame)
        writer.append_data(frame)
    writer.close()


def get_audio_features(wav2vec, audio_processor, audio_path, fps, num_frames):
    sr = 16000
    audio_, orig_sr = librosa.load(audio_path, sr=None)  # 这里无法指定输出采样率，给定None，然后重采样保证输入模型的音频为16k
    audio_input = librosa.resample(audio_, orig_sr=orig_sr, target_sr=sr)

    start_time = 0
    # end_time = (0 + (num_frames - 1) * 1) / fps
    end_time = num_frames / fps

    start_sample = int(start_time * sr)
    end_sample = int(end_time * sr)

    try:
        audio_segment = audio_input[start_sample:end_sample]
    except:
        audio_segment = audio_input

    input_values = audio_processor(
        audio_segment, sampling_rate=sample_rate, return_tensors="pt"
    ).input_values.to("cuda")

    with torch.no_grad():
        fea = wav2vec(input_values).last_hidden_state

    return fea
