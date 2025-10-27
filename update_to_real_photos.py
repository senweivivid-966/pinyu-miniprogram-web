#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import base64
import os

def create_realistic_photo_avatar(name, gender='male', style='professional', bg_color='#4F79A4'):
    """创建真人照片风格的头像SVG"""
    
    # 根据性别和风格调整特征
    if gender == 'female':
        # 女性特征
        face_shape = 'M35,25 Q35,20 40,18 Q50,15 60,18 Q65,20 65,25 Q65,35 60,45 Q50,48 40,45 Q35,35 35,25'
        hair_style = 'M30,20 Q25,10 35,8 Q50,5 65,8 Q75,10 70,20 Q70,15 65,12 Q50,8 35,12 Q30,15 30,20'
        eyebrow_shape = 'M40,28 Q43,26 46,28 M54,28 Q57,26 60,28'
        lip_color = '#D4756B'
        cheek_blush = True
    else:
        # 男性特征
        face_shape = 'M38,25 Q38,18 42,16 Q50,14 58,16 Q62,18 62,25 Q62,38 58,46 Q50,49 42,46 Q38,38 38,25'
        hair_style = 'M32,22 Q28,12 38,10 Q50,8 62,10 Q72,12 68,22 Q68,18 62,15 Q50,12 38,15 Q32,18 32,22'
        eyebrow_shape = 'M40,28 L46,27 M54,27 L60,28'
        lip_color = '#C4756B'
        cheek_blush = False
    
    # 肤色选择（更真实的亚洲人肤色）
    skin_tones = {
        'light': '#F5E6D3',
        'medium': '#E8C4A0', 
        'tan': '#D4A574',
        'warm': '#E6B887'
    }
    
    # 为不同成员分配不同肤色
    skin_mapping = {
        'Ryan': 'medium',
        'Yuki': 'light', 
        'Victor': 'tan',
        'Jack': 'warm',
        'Ivan': 'light',
        'Emma': 'light'
    }
    
    skin_tone = skin_mapping.get(name, 'medium')
    skin_color = skin_tones[skin_tone]
    
    # 头发颜色
    hair_colors = {
        'black': '#1A1A1A',
        'dark_brown': '#2D1B0E',
        'brown': '#4A2C17'
    }
    
    hair_mapping = {
        'Ryan': 'black',
        'Yuki': 'dark_brown',
        'Victor': 'brown', 
        'Jack': 'black',
        'Ivan': 'brown',
        'Emma': 'dark_brown'
    }
    
    hair_color = hair_colors[hair_mapping.get(name, 'black')]
    
    # 获取名字首字母
    initial = name[0].upper()
    
    # 创建更真实的照片风格SVG
    svg_content = f'''<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <!-- 渐变定义 -->
            <radialGradient id="faceGradient_{name}" cx="50%" cy="40%" r="60%">
                <stop offset="0%" style="stop-color:{skin_color};stop-opacity:1" />
                <stop offset="100%" style="stop-color:#D4A574;stop-opacity:0.8" />
            </radialGradient>
            <linearGradient id="hairGradient_{name}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:{hair_color};stop-opacity:1" />
                <stop offset="100%" style="stop-color:#000000;stop-opacity:0.8" />
            </linearGradient>
            <!-- 阴影滤镜 -->
            <filter id="shadow_{name}" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
            </filter>
        </defs>
        
        <!-- 背景圆 -->
        <circle cx="50" cy="50" r="50" fill="{bg_color}"/>
        
        <!-- 头发 -->
        <path d="{hair_style}" fill="url(#hairGradient_{name})" filter="url(#shadow_{name})"/>
        
        <!-- 脸部轮廓 -->
        <path d="{face_shape}" fill="url(#faceGradient_{name})" filter="url(#shadow_{name})"/>
        
        <!-- 眼睛 -->
        <ellipse cx="43" cy="32" rx="4" ry="3" fill="white"/>
        <ellipse cx="57" cy="32" rx="4" ry="3" fill="white"/>
        <!-- 瞳孔 -->
        <circle cx="43" cy="32" r="2" fill="#2C1810"/>
        <circle cx="57" cy="32" r="2" fill="#2C1810"/>
        <!-- 高光 -->
        <circle cx="44" cy="31" r="0.8" fill="white"/>
        <circle cx="58" cy="31" r="0.8" fill="white"/>
        <!-- 眼睫毛 -->
        <path d="M39,30 Q43,29 47,30" stroke="#1A1A1A" stroke-width="0.5" fill="none"/>
        <path d="M53,30 Q57,29 61,30" stroke="#1A1A1A" stroke-width="0.5" fill="none"/>
        
        <!-- 眉毛 -->
        <path d="{eyebrow_shape}" stroke="{hair_color}" stroke-width="2" fill="none"/>
        
        <!-- 鼻子 -->
        <path d="M50,35 L50,40 M49,40 Q50,41 51,40" stroke="#C4A574" stroke-width="1.2" fill="none"/>
        <!-- 鼻翼阴影 -->
        <ellipse cx="48" cy="39" rx="1" ry="0.5" fill="#D4A574" opacity="0.5"/>
        <ellipse cx="52" cy="39" rx="1" ry="0.5" fill="#D4A574" opacity="0.5"/>
        
        <!-- 嘴巴 -->
        <path d="M46,44 Q50,46 54,44" stroke="{lip_color}" stroke-width="2" fill="none"/>
        <!-- 下唇 -->
        <path d="M47,45 Q50,46.5 53,45" stroke="{lip_color}" stroke-width="1" fill="none" opacity="0.7"/>'''
    
    # 添加脸颊红晕（女性）
    if cheek_blush:
        svg_content += f'''
        <!-- 脸颊红晕 -->
        <ellipse cx="38" cy="38" rx="3" ry="2" fill="#F4A4A4" opacity="0.4"/>
        <ellipse cx="62" cy="38" rx="3" ry="2" fill="#F4A4A4" opacity="0.4"/>'''
    
    # 添加面部轮廓阴影
    svg_content += f'''
        <!-- 面部轮廓阴影 -->
        <path d="M38,42 Q42,45 46,42" stroke="#C4A574" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M54,42 Q58,45 62,42" stroke="#C4A574" stroke-width="0.5" fill="none" opacity="0.6"/>
        
        <!-- 字母标识 -->
        <text x="50" y="75" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" filter="url(#shadow_{name})">{initial}</text>
    </svg>'''
    
    return base64.b64encode(svg_content.encode('utf-8')).decode('utf-8')

def update_avatars_to_real_photos():
    """更新HTML文件中的头像为真人照片风格"""
    
    # 会员数据配置
    members_config = [
        {'name': 'Ryan', 'gender': 'male', 'style': 'professional', 'bg_color': '#4F79A4'},
        {'name': 'Yuki', 'gender': 'female', 'style': 'friendly', 'bg_color': '#ED548C'},
        {'name': 'Victor', 'gender': 'male', 'style': 'casual', 'bg_color': '#10B981'},
        {'name': 'Jack', 'gender': 'male', 'style': 'professional', 'bg_color': '#F59E0B'},
        {'name': 'Ivan', 'gender': 'male', 'style': 'friendly', 'bg_color': '#8B5CF6'},
        {'name': 'Emma', 'gender': 'female', 'style': 'professional', 'bg_color': '#EC4899'}
    ]
    
    # 读取HTML文件
    with open('home.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 更新每个会员的头像
    for member in members_config:
        name = member['name']
        new_avatar = create_realistic_photo_avatar(
            name, 
            member['gender'], 
            member['style'],
            member['bg_color']
        )
        
        # 构建新的头像数据URL
        new_avatar_url = f"data:image/svg+xml;base64,{new_avatar}"
        
        # 使用正则表达式替换对应会员的头像
        pattern = rf"({{ id: \d+, name: '{name}', avatar: ')([^']+)(')"
        replacement = rf"\g<1>{new_avatar_url}\g<3>"
        
        old_content = content
        content = re.sub(pattern, replacement, content)
        
        if content != old_content:
            print(f"✅ 已更新 {name} 的头像为真人照片风格")
        else:
            print(f"⚠️  未找到 {name} 的头像数据")
    
    # 写回文件
    with open('home.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("🎉 所有会员头像已更新为真人照片风格！")

if __name__ == "__main__":
    update_avatars_to_real_photos()