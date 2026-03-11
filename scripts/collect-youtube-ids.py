#!/usr/bin/env python3
# /// script
# requires-python = ">=3.12"
# dependencies = ["yt-dlp"]
# ///
"""
YouTube動画ID収集スクリプト（番組別）
Usage: uv run scripts/collect-youtube-ids.py <show-id>

対象番組:
  produce48          - PRODUCE 48（プレースホルダー16名）
  boys-planet        - Boys Planet（全96名 kprofiles→YouTube）
  produce101-s2      - PRODUCE 101 S2（全37名）
  produce101         - PRODUCE 101（全70名）
  produce101-japan-girls - PRODUCE 101 JAPAN THE GIRLS（全69名）
  produce101-japan   - PRODUCE 101 JAPAN（全11名）
  produce101-japan-s2 - PRODUCE 101 JAPAN S2（全11名）
  i-land             - I-LAND（全10名）
  girls-planet-999   - Girls Planet 999（全3名）
  produce-x-101      - PRODUCE X 101（全3名）
"""

import sys
import json
import time
import urllib.request

import yt_dlp

# ===== 番組別設定 =====
SHOW_CONFIGS = {
    'produce48': {
        'query_template': 'PRODUCE48 [48스페셜] 도전! 아.이.컨.택 {name}',
        'expected_channel': 'Mnet TV',
        'contestants': [
            # プレースホルダーのみ（image='/images/contestants/placeholder.jpg'）
            {'id': 'go-yujin', 'displayName': '고유진', 'furigana': 'コ・ユジン'},
            {'id': 'won-seoyeon', 'displayName': '원서연', 'furigana': 'ウォン・ソヨン'},
            {'id': 'huh-yunjin', 'displayName': '허윤진', 'furigana': 'ホ・ユンジン'},
            {'id': 'yoon-haesol', 'displayName': '윤해솔', 'furigana': 'ユン・ヘソル'},
            {'id': 'choi-soeun', 'displayName': '최소은', 'furigana': 'チェ・ソウン'},
            {'id': 'lee-chaeyeon', 'displayName': '이채연', 'furigana': 'イ・チェヨン'},
            {'id': 'lee-seunghyeon', 'displayName': '이승현', 'furigana': 'イ・スンヒョン'},
            {'id': 'cho-yeongin', 'displayName': '조영인', 'furigana': 'チョ・ヨンイン'},
            {'id': 'kim-sohee', 'displayName': '김소희', 'furigana': 'キム・ソヒ'},
            {'id': 'miku-tanaka', 'displayName': '田中美久', 'furigana': 'タナカ・ミク'},
            {'id': 'amane-tsukiashi', 'displayName': '月足天音', 'furigana': 'ツキアシ・アマネ'},
            {'id': 'sae-murase', 'displayName': '村瀬紗英', 'furigana': 'ムラセ・サエ'},
            {'id': 'kokoro-naiki', 'displayName': '内木志', 'furigana': 'ナイキ・ココロ'},
            {'id': 'cocona-umeyama', 'displayName': '梅山恋和', 'furigana': 'ウメヤマ・ココナ'},
            {'id': 'azusa-uemura', 'displayName': '植村梓', 'furigana': 'ウエムラ・アズサ'},
            {'id': 'kim-suyun', 'displayName': '김수윤', 'furigana': 'キム・スユン'},
        ],
    },

    'boys-planet': {
        'query_template': 'BOYS PLANET {name} 타임어택 1분 자기소개',
        'expected_channel': 'Mnet K-POP',
        'contestants': [
            {'id': 'bak-do-ha', 'displayName': '박도하', 'furigana': 'パク・ドハ'},
            {'id': 'cha-woong-ki', 'displayName': '차웅기', 'furigana': 'チャ・ウンギ'},
            {'id': 'choi-ji-ho', 'displayName': '최지호', 'furigana': 'チェ・ジホ'},
            {'id': 'choi-seung-hun', 'displayName': '최승훈', 'furigana': 'チェ・スンフン'},
            {'id': 'choi-woo-jin', 'displayName': '최우진', 'furigana': 'チェ・ウジン'},
            {'id': 'han-seo-bin', 'displayName': '한서빈', 'furigana': 'ハン・ソビン'},
            {'id': 'han-yu-jin', 'displayName': '한유진', 'furigana': 'ハン・ユジン'},
            {'id': 'han-yu-seop', 'displayName': '한유섭', 'furigana': 'ハン・ユソプ'},
            {'id': 'hong-keon-hee', 'displayName': '홍건희', 'furigana': 'ホン・ゴンヒ'},
            {'id': 'jang-ji-ho', 'displayName': '장지호', 'furigana': 'チャン・ジホ'},
            {'id': 'jang-min-seo', 'displayName': '장민서', 'furigana': 'チャン・ミンソ'},
            {'id': 'jang-yeo-jun', 'displayName': '장여준', 'furigana': 'チャン・ヨジュン'},
            {'id': 'jeon-ho-young', 'displayName': '전호영', 'furigana': 'チョン・ホヨン'},
            {'id': 'jeon-woo-seok', 'displayName': '전우석', 'furigana': 'チョン・ウソク'},
            {'id': 'jeong-i-chan', 'displayName': '정이찬', 'furigana': 'チョン・イチャン'},
            {'id': 'ji-yun-seo', 'displayName': '지윤서', 'furigana': 'ジ・ユンソ'},
            {'id': 'jo-eun-woo', 'displayName': '조은우', 'furigana': 'チョ・ウンウ'},
            {'id': 'jung-ho-jin', 'displayName': '정호진', 'furigana': 'チョン・ホジン'},
            {'id': 'jung-hwan-rok', 'displayName': '정환록', 'furigana': 'チョン・ファン록'},
            {'id': 'jung-min-gyu', 'displayName': '정민규', 'furigana': 'チョン・ミンギュ'},
            {'id': 'jung-se-yun', 'displayName': '정세윤', 'furigana': 'チョン・セユン'},
            {'id': 'kim-gyu-vin', 'displayName': '김규빈', 'furigana': 'キム・ギュビン'},
            {'id': 'kim-ji-woong', 'displayName': '김지웅', 'furigana': 'キム・ジウン'},
            {'id': 'kim-min-hyuk', 'displayName': '김민혁', 'furigana': 'キム・ミンヒョク'},
            {'id': 'kim-min-seoung', 'displayName': '김민성', 'furigana': 'キム・ミンソン'},
            {'id': 'kim-tae-rae', 'displayName': '김태래', 'furigana': 'キム・テレ'},
            {'id': 'kum-jun-hyeon', 'displayName': '금준현', 'furigana': 'クム・ジュンヒョン'},
            {'id': 'lee-da-eul', 'displayName': '이다을', 'furigana': 'イ・ダウル'},
            {'id': 'lee-dong-gun', 'displayName': '이동건', 'furigana': 'イ・ドンゴン'},
            {'id': 'lee-dong-yeol', 'displayName': '이동열', 'furigana': 'イ・ドンヨル'},
            {'id': 'lee-hoe-taek', 'displayName': '이회택', 'furigana': 'イ・フェテク'},
            {'id': 'lee-hwan-hee', 'displayName': '이환희', 'furigana': 'イ・ファンヒ'},
            {'id': 'lee-jeong-hyeon', 'displayName': '이정현', 'furigana': 'イ・ジョンヒョン'},
            {'id': 'lee-seung-hwan', 'displayName': '이승환', 'furigana': 'イ・スンファン'},
            {'id': 'lee-ye-dam', 'displayName': '이예담', 'furigana': 'イ・イェダム'},
            {'id': 'lim-jun-seo', 'displayName': '임준서', 'furigana': 'イム・ジュンソ'},
            {'id': 'mun-jung-hyun', 'displayName': '문정현', 'furigana': 'ムン・ジョンヒョン'},
            {'id': 'oh-sung-min', 'displayName': '오성민', 'furigana': 'オ・ソンミン'},
            {'id': 'park-gun-wook', 'displayName': '박건욱', 'furigana': 'パク・ゴヌク'},
            {'id': 'park-gwan-young', 'displayName': '박관영', 'furigana': 'パク・グァンヨン'},
            {'id': 'park-han-bin', 'displayName': '박한빈', 'furigana': 'パク・ハンビン'},
            {'id': 'park-hyun-been', 'displayName': '박현빈', 'furigana': 'パク・ヒョンビン'},
            {'id': 'park-ji-hoo', 'displayName': '박지후', 'furigana': 'パク・ジフ'},
            {'id': 'park-min-seok', 'displayName': '박민석', 'furigana': 'パク・ミンソク'},
            {'id': 'seo-won', 'displayName': '서원', 'furigana': 'ソ・ウォン'},
            {'id': 'sung-han-bin', 'displayName': '성한빈', 'furigana': 'ソン・ハンビン'},
            {'id': 'yeom-tae-gyun', 'displayName': '염태균', 'furigana': 'ヨム・テギュン'},
            {'id': 'yoo-seung-eon', 'displayName': '유승언', 'furigana': 'ユ・スンオン'},
            {'id': 'yoon-jong-woo', 'displayName': '윤종우', 'furigana': 'ユン・ジョンウ'},
            {'id': 'anthonny', 'displayName': '안토니', 'furigana': 'アントニー'},
            {'id': 'brian', 'displayName': '브라이언', 'furigana': 'ブライアン'},
            {'id': 'cai-jinxin', 'displayName': '차이진신', 'furigana': 'ツァイ・ジンシン'},
            {'id': 'chen-jianyu', 'displayName': '천지안위', 'furigana': 'チェン・ジアンユー'},
            {'id': 'chen-kuanjui', 'displayName': '천관루이', 'furigana': 'チェン・グァンルイ'},
            {'id': 'chen-yugeng', 'displayName': '천위겅', 'furigana': 'チェン・ユーゲン'},
            {'id': 'cong', 'displayName': '콩', 'furigana': 'コン'},
            {'id': 'dang-hong-hai', 'displayName': '당홍하이', 'furigana': 'ダン・ホンハイ'},
            {'id': 'dong-dong', 'displayName': '동동', 'furigana': 'ドンドン'},
            {'id': 'feng-junlan', 'displayName': '펑준란', 'furigana': 'フォン・ジュンラン'},
            {'id': 'haru', 'displayName': '하루', 'furigana': 'ハル'},
            {'id': 'haruto', 'displayName': '하루토', 'furigana': 'ハルト'},
            {'id': 'hiroto', 'displayName': '히로토', 'furigana': 'ヒロト'},
            {'id': 'hyo', 'displayName': '효', 'furigana': 'ヒョ'},
            {'id': 'ichika', 'displayName': '이치카', 'furigana': 'イチカ'},
            {'id': 'itsuki', 'displayName': '이츠키', 'furigana': 'イツキ'},
            {'id': 'jay', 'displayName': '제이', 'furigana': 'ジェイ'},
            {'id': 'kei', 'displayName': '케이', 'furigana': 'ケイ'},
            {'id': 'keita', 'displayName': '케이타', 'furigana': 'ケイタ'},
            {'id': 'krystian', 'displayName': '크리스티안', 'furigana': 'クリスティアン'},
            {'id': 'lin-shiyuan', 'displayName': '린시위안', 'furigana': 'リン・シーユアン'},
            {'id': 'ma-jingxiang', 'displayName': '마징샹', 'furigana': 'マー・ジンシャン'},
            {'id': 'min', 'displayName': '민', 'furigana': 'ミン'},
            {'id': 'na-kamden', 'displayName': '나캠든', 'furigana': 'ナ・カムデン'},
            {'id': 'nice', 'displayName': '나이스', 'furigana': 'ナイス'},
            {'id': 'ollie', 'displayName': '올리', 'furigana': 'オリー'},
            {'id': 'osuke', 'displayName': '오스케', 'furigana': 'オースケ'},
            {'id': 'ouju', 'displayName': '오쥬', 'furigana': 'オージュ'},
            {'id': 'qiu-shengyang', 'displayName': '치우성양', 'furigana': 'チウ・シェンヤン'},
            {'id': 'ricky', 'displayName': '리키', 'furigana': 'リッキー'},
            {'id': 'riku', 'displayName': '리쿠', 'furigana': 'リク'},
            {'id': 'seok-matthew', 'displayName': '석매튜', 'furigana': 'ソク・マシュー'},
            {'id': 'takuto', 'displayName': '타쿠토', 'furigana': 'タクト'},
            {'id': 'tao-yuan', 'displayName': '도원', 'furigana': 'タオ・ユアン'},
            {'id': 'toui', 'displayName': '토우이', 'furigana': 'トウイ'},
            {'id': 'wang-yanhong', 'displayName': '왕옌홍', 'furigana': 'ワン・イェンホン'},
            {'id': 'wang-zihao', 'displayName': '왕즈하오', 'furigana': 'ワン・ズーハオ'},
            {'id': 'wen-yechen', 'displayName': '원예천', 'furigana': 'ウェン・イェチェン'},
            {'id': 'winnie', 'displayName': '위니', 'furigana': 'ウィニー'},
            {'id': 'wumuti', 'displayName': '우무티', 'furigana': 'ウムティ'},
            {'id': 'xuan-hao', 'displayName': '쉬안하오', 'furigana': 'シュアン・ハオ'},
            {'id': 'yang-jun', 'displayName': '양쥔', 'furigana': 'ヤン・ジュン'},
            {'id': 'yuki', 'displayName': '유키', 'furigana': 'ユキ'},
            {'id': 'yuto', 'displayName': '유토', 'furigana': 'ユウト'},
            {'id': 'zhang-hao', 'displayName': '장하오', 'furigana': 'チャン・ハオ'},
            {'id': 'zhang-shuaibo', 'displayName': '장슈아이보', 'furigana': 'チャン・シュアイボー'},
        ],
    },

    'produce101-s2': {
        'query_template': 'PRODUCE 101 season2 {name} 자기소개 1분 PR',
        'expected_channel': 'Mnet TV',
        'contestants': [
            {'id': 'kang-daniel', 'displayName': '강다니엘', 'furigana': 'カン・ダニエル'},
            {'id': 'park-jihoon', 'displayName': '박지훈', 'furigana': 'パク・ジフン'},
            {'id': 'lee-daehwi', 'displayName': '이대휘', 'furigana': 'イ・デフィ'},
            {'id': 'kim-jaehwan', 'displayName': '김재환', 'furigana': 'キム・ジェファン'},
            {'id': 'ong-seongwu', 'displayName': '옹성우', 'furigana': 'オン・ソンウ'},
            {'id': 'park-woojin', 'displayName': '박우진', 'furigana': 'パク・ウジン'},
            {'id': 'lai-guanlin', 'displayName': '라이관린', 'furigana': 'ライ・グァンリン'},
            {'id': 'yoon-jisung', 'displayName': '윤지성', 'furigana': 'ユン・ジソン'},
            {'id': 'hwang-minhyun', 'displayName': '황민현', 'furigana': 'ファン・ミニョン'},
            {'id': 'bae-jinyoung', 'displayName': '배진영', 'furigana': 'ペ・ジニョン'},
            {'id': 'ha-sungwoon', 'displayName': '하성운', 'furigana': 'ハ・ソンウン'},
            {'id': 'jung-sewoon', 'displayName': '정세운', 'furigana': 'チョン・セウン'},
            {'id': 'kim-jonghyun', 'displayName': '김종현', 'furigana': 'キム・ジョンヒョン'},
            {'id': 'kang-dongho', 'displayName': '강동호', 'furigana': 'カン・ドンホ'},
            {'id': 'lim-youngmin', 'displayName': '임영민', 'furigana': 'イム・ヨンミン'},
            {'id': 'ahn-hyeongseop', 'displayName': '안형섭', 'furigana': 'アン・ヒョンソプ'},
            {'id': 'yoo-seonho', 'displayName': '유선호', 'furigana': 'ユ・ソンホ'},
            {'id': 'kim-samuel', 'displayName': '김사무엘', 'furigana': 'キム・サムエル'},
            {'id': 'joo-haknyeon', 'displayName': '주학년', 'furigana': 'ジュ・ハンニョン'},
            {'id': 'choi-minki', 'displayName': '최민기', 'furigana': 'チェ・ミンギ'},
            {'id': 'jin-longguo', 'displayName': '진롱구어', 'furigana': 'ジン・ロングオ'},
            {'id': 'kwon-hyunbin', 'displayName': '권현빈', 'furigana': 'クォン・ヒョンビン'},
            {'id': 'lee-euiwoong', 'displayName': '이의웅', 'furigana': 'イ・ウィウン'},
            {'id': 'takada-kenta', 'displayName': '타카다 켄타', 'furigana': 'タカダ・ケンタ'},
            {'id': 'noh-taehyun', 'displayName': '노태현', 'furigana': 'ノ・テヒョン'},
            {'id': 'kim-sanggyun', 'displayName': '김상균', 'furigana': 'キム・サンギュン'},
            {'id': 'jang-moonbok', 'displayName': '장문복', 'furigana': 'チャン・ムンボク'},
            {'id': 'kim-donghyun', 'displayName': '김동현', 'furigana': 'キム・ドンヒョン'},
            {'id': 'kim-donghan', 'displayName': '김동한', 'furigana': 'キム・ドンハン'},
            {'id': 'kim-taedong', 'displayName': '김태동', 'furigana': 'キム・テドン'},
            {'id': 'seo-sanghyuk', 'displayName': '서상혁', 'furigana': 'ソ・サンヒョク'},
            {'id': 'kim-yehyeon', 'displayName': '김예현', 'furigana': 'キム・イェヒョン'},
            {'id': 'lee-gunhee', 'displayName': '이건희', 'furigana': 'イ・ゴンヒ'},
            {'id': 'lee-woojin', 'displayName': '이우진', 'furigana': 'イ・ウジン'},
            {'id': 'park-woodam', 'displayName': '박우담', 'furigana': 'パク・ウダム'},
            {'id': 'jeong-dongsu', 'displayName': '정동수', 'furigana': 'チョン・ドンス'},
            {'id': 'park-sungwoo', 'displayName': '박성우', 'furigana': 'パク・ソンウ'},
        ],
    },

    'produce101': {
        'query_template': 'Produce 101 {name} 1:1 Eyecontact',
        'expected_channel': 'Mnet TV',
        'contestants': [
            {'id': 'jeon-somi', 'displayName': '전소미', 'furigana': 'チョン・ソミ'},
            {'id': 'kim-sejeong', 'displayName': '김세정', 'furigana': 'キム・セジョン'},
            {'id': 'choi-yoojung', 'displayName': '최유정', 'furigana': 'チェ・ユジョン'},
            {'id': 'kim-chungha', 'displayName': '김청하', 'furigana': 'キム・チョンハ'},
            {'id': 'kim-sohye', 'displayName': '김소혜', 'furigana': 'キム・ソヘ'},
            {'id': 'zhou-jieqiong', 'displayName': '주결경', 'furigana': 'チュ・ジエチョン'},
            {'id': 'jung-chaeyeon', 'displayName': '정채연', 'furigana': 'チョン・チェヨン'},
            {'id': 'kim-doyeon', 'displayName': '김도연', 'furigana': 'キム・ドヨン'},
            {'id': 'kang-mina', 'displayName': '강미나', 'furigana': 'カン・ミナ'},
            {'id': 'im-nayoung', 'displayName': '임나영', 'furigana': 'イム・ナヨン'},
            {'id': 'yoo-yeonjung', 'displayName': '유연정', 'furigana': 'ユ・ヨンジョン'},
            {'id': 'han-hyeri', 'displayName': '한혜리', 'furigana': 'ハン・ヘリ'},
            {'id': 'lee-suhyun', 'displayName': '이수현', 'furigana': 'イ・スヒョン'},
            {'id': 'kim-nayoung', 'displayName': '김나영', 'furigana': 'キム・ナヨン'},
            {'id': 'kim-sohee', 'displayName': '김소희', 'furigana': 'キム・ソヒ'},
            {'id': 'yoon-chaekyung', 'displayName': '윤채경', 'furigana': 'ユン・チェギョン'},
            {'id': 'lee-haein', 'displayName': '이해인', 'furigana': 'イ・ヘイン'},
            {'id': 'park-soyeon', 'displayName': '박소연', 'furigana': 'パク・ソヨン'},
            {'id': 'ki-huihyeon', 'displayName': '기희현', 'furigana': 'キ・フィヒョン'},
            {'id': 'jeon-soyeon', 'displayName': '전소연', 'furigana': 'チョン・ソヨン'},
            {'id': 'jung-eunwoo', 'displayName': '정은우', 'furigana': 'チョン・ウヌ'},
            {'id': 'kang-sira', 'displayName': '강시라', 'furigana': 'カン・シラ'},
            {'id': 'ng-sze-kai', 'displayName': '엔지 스카이', 'furigana': 'ン・スカイ'},
            {'id': 'park-siyeon', 'displayName': '박시연', 'furigana': 'パク・シヨン'},
            {'id': 'kim-dani', 'displayName': '김다니', 'furigana': 'キム・ダニ'},
            {'id': 'huh-chanmi', 'displayName': '허찬미', 'furigana': 'ホ・チャンミ'},
            {'id': 'hwang-insun', 'displayName': '황인선', 'furigana': 'ファン・インソン'},
            {'id': 'seong-hyemin', 'displayName': '성혜민', 'furigana': 'ソン・ヘミン'},
            {'id': 'kang-yaebin', 'displayName': '강예빈', 'furigana': 'カン・イェビン'},
            {'id': 'kim-seokyung', 'displayName': '김서경', 'furigana': 'キム・ソギョン'},
            {'id': 'lee-soomin', 'displayName': '이수민', 'furigana': 'イ・スミン'},
            {'id': 'an-yeseul', 'displayName': '안예슬', 'furigana': 'アン・イェスル'},
            {'id': 'kim-hyungeun', 'displayName': '김형은', 'furigana': 'キム・ヒョンウン'},
            {'id': 'kim-juna', 'displayName': '김주나', 'furigana': 'キム・ジュナ'},
            {'id': 'kwon-eunbin', 'displayName': '권은빈', 'furigana': 'クォン・ウンビン'},
            {'id': 'kang-siwon', 'displayName': '강시원', 'furigana': 'カン・シウォン'},
            {'id': 'yoon-seohyung', 'displayName': '윤서형', 'furigana': 'ユン・ソヒョン'},
            {'id': 'park-haeyoung', 'displayName': '박해영', 'furigana': 'パク・ヘヨン'},
            {'id': 'hwang-sooyeon', 'displayName': '황수연', 'furigana': 'ファン・スヨン'},
            {'id': 'kim-sihyun', 'displayName': '김시현', 'furigana': 'キム・シヒョン'},
            {'id': 'cho-shiyoon', 'displayName': '조시윤', 'furigana': 'チョ・シユン'},
            {'id': 'kim-minkyung', 'displayName': '김민경', 'furigana': 'キム・ミンギョン'},
            {'id': 'park-sehee', 'displayName': '박세희', 'furigana': 'パク・セヒ'},
            {'id': 'kim-minji', 'displayName': '김민지', 'furigana': 'キム・ミンジ'},
            {'id': 'kim-minjung', 'displayName': '김민정', 'furigana': 'キム・ミンジョン'},
            {'id': 'chu-yejin', 'displayName': '추예진', 'furigana': 'チュ・イェジン'},
            {'id': 'jung-haerim', 'displayName': '정해림', 'furigana': 'チョン・ヘリム'},
            {'id': 'kang-kyungwon', 'displayName': '강경원', 'furigana': 'カン・ギョンウォン'},
            {'id': 'oh-seojung', 'displayName': '오서정', 'furigana': 'オ・ソジョン'},
            {'id': 'kim-taeha', 'displayName': '김태하', 'furigana': 'キム・テハ'},
            {'id': 'park-hayi', 'displayName': '박하이', 'furigana': 'パク・ハイ'},
            {'id': 'park-gaeul', 'displayName': '박가을', 'furigana': 'パク・カウル'},
            {'id': 'yu-sua', 'displayName': '유수아', 'furigana': 'ユ・スア'},
            {'id': 'lee-jinhee', 'displayName': '이진희', 'furigana': 'イ・ジニ'},
            {'id': 'ariyoshi-risa', 'displayName': '아리요시 리사', 'furigana': 'アリヨシ・リサ'},
            {'id': 'hwang-ayoung', 'displayName': '황아영', 'furigana': 'ファン・アヨン'},
            {'id': 'im-jungmin', 'displayName': '임정민', 'furigana': 'イム・ジョンミン'},
            {'id': 'kim-yeonkyung', 'displayName': '김연경', 'furigana': 'キム・ヨンギョン'},
            {'id': 'lee-younseo', 'displayName': '이윤서', 'furigana': 'イ・ユンソ'},
            {'id': 'shim-chaeeun', 'displayName': '심채은', 'furigana': 'シム・チェウン'},
            {'id': 'kang-sihyeon', 'displayName': '강시현', 'furigana': 'カン・シヒョン'},
        ],
    },

    'produce101-japan-girls': {
        'query_template': 'PRODUCE 101 JAPAN THE GIRLS {name} 1分PR',
        'expected_channel': 'PRODUCE 101 JAPAN 新世界',
        'contestants': [
            {'id': 'kasahara-momona', 'displayName': '笠原桃奈'},
            {'id': 'murakami-rinon', 'displayName': '村上璃杏'},
            {'id': 'takami-ayane', 'displayName': '高見文寧'},
            {'id': 'sakurai-miu', 'displayName': '櫻井美羽'},
            {'id': 'yamamoto-suzu', 'displayName': '山本すず'},
            {'id': 'sasaki-kokona', 'displayName': '佐々木心菜'},
            {'id': 'iida-shizuku', 'displayName': '飯田栞月'},
            {'id': 'shimizu-keiko', 'displayName': '清水恵子'},
            {'id': 'ishii-ran', 'displayName': '石井蘭'},
            {'id': 'ebihara-tsuzumi', 'displayName': '海老原鼓'},
            {'id': 'kato-kokoro', 'displayName': '加藤心'},
            {'id': 'sakaguchi-rino', 'displayName': '坂口梨乃'},
            {'id': 'kato-kagura', 'displayName': '加藤神楽'},
            {'id': 'kenmotsu-nano', 'displayName': '剣持なの'},
            {'id': 'tanaka-yuki', 'displayName': '田中優希'},
            {'id': 'tanaka-koto', 'displayName': '田中琴'},
            {'id': 'fujimoto-ayaka', 'displayName': '藤本彩花'},
            {'id': 'kitazato-rio', 'displayName': '北里理桜'},
            {'id': 'hatta-mena', 'displayName': '八田芽奈'},
            {'id': 'ando-yui-25', 'displayName': '安藤ゆい'},
            {'id': 'aita-rin', 'displayName': '会田凛'},
            {'id': 'takabatake-momoka', 'displayName': '髙畑百香'},
            {'id': 'sutani-ririka', 'displayName': '須谷莉々花'},
            {'id': 'saito-serina', 'displayName': '斉藤芹菜'},
            {'id': 'aramaki-joa', 'displayName': '荒牧深愛'},
            {'id': 'abe-nagomi', 'displayName': '阿部和'},
            {'id': 'kamio-ayano', 'displayName': '神尾絢乃'},
            {'id': 'takahashi-hina', 'displayName': '高橋妃那'},
            {'id': 'sasaki-tsukushi', 'displayName': '佐々木つくし'},
            {'id': 'kitazume-sakura', 'displayName': '北爪さくら'},
            {'id': 'matsushita-miyu', 'displayName': '松下美夢'},
            {'id': 'yoshida-hana', 'displayName': '吉田華'},
            {'id': 'sutani-yurara', 'displayName': '須谷ゆらら'},
            {'id': 'kawabata-ranka', 'displayName': '川端蘭花'},
            {'id': 'hidaka-hazuki', 'displayName': '日高葉月'},
            {'id': 'nakano-kokona-35', 'displayName': '中野心愛'},
            {'id': 'sakata-kotone', 'displayName': '坂田琴音'},
            {'id': 'yoshida-ayano', 'displayName': '吉田彩乃'},
            {'id': 'koyama-mana', 'displayName': '小山麻菜'},
            {'id': 'uchiyama-rin', 'displayName': '内山凜'},
            {'id': 'otsubo-fuuren', 'displayName': '大坪楓恋'},
            {'id': 'akiyama-ai', 'displayName': '秋山愛'},
            {'id': 'takagi-mayu', 'displayName': '髙木舞優'},
            {'id': 'mizukami-rimika', 'displayName': '水上凜巳花'},
            {'id': 'ando-chiharu', 'displayName': '安藤千陽'},
            {'id': 'yamazaki-mitsuki', 'displayName': '山崎美月'},
            {'id': 'kanno-miyu', 'displayName': '菅野美優'},
            {'id': 'nakamori-kotone', 'displayName': '中森琴音'},
            {'id': 'sudo-samu', 'displayName': '須藤紗暮'},
            {'id': 'nakamori-mikoto', 'displayName': '中森美琴'},
            {'id': 'aoki-yuka', 'displayName': '青木友香'},
            {'id': 'iyota-hana', 'displayName': '井餘田華'},
            {'id': 'ueki-mimi', 'displayName': '植木美々'},
            {'id': 'oikawa-rio', 'displayName': '及川里桜'},
            {'id': 'ota-sara', 'displayName': '太田紗蘭'},
            {'id': 'okabe-nonoka', 'displayName': '岡部望々花'},
            {'id': 'okamura-nana', 'displayName': '岡村菜那'},
            {'id': 'oda-aruha', 'displayName': '小田有葉'},
            {'id': 'koyanagi-emi', 'displayName': '小栁絵美'},
            {'id': 'kataoka-rio', 'displayName': '片岡陽音'},
            {'id': 'kato-airi', 'displayName': '加藤愛梨'},
            {'id': 'kato-konomi', 'displayName': '加藤好実'},
            {'id': 'kamada-moe', 'displayName': '鎌田萌'},
            {'id': 'kawagishi-runa', 'displayName': '川岸瑠那'},
            {'id': 'kikukawa-aki', 'displayName': '菊川亜樹'},
            {'id': 'kino-riko', 'displayName': '木野稟子'},
            {'id': 'kurihara-kano', 'displayName': '栗原果乃'},
            {'id': 'kurokawa-honoka', 'displayName': '黒川穂香'},
            {'id': 'kobayashi-sae', 'displayName': '小林さえ'},
            {'id': 'sakuraba-haruka', 'displayName': '桜庭遥花'},
            {'id': 'sato-ameli', 'displayName': '佐藤あめり'},
            {'id': 'sano-jueri', 'displayName': '佐野じゅえり'},
            {'id': 'shibagaki-arisa', 'displayName': '柴垣有佐'},
            {'id': 'shibuya-mei', 'displayName': '渋谷芽衣'},
            {'id': 'shiromaru-maho', 'displayName': '城丸真歩'},
            {'id': 'shinzawa-mika', 'displayName': '新澤実華'},
            {'id': 'sugai-natsuho', 'displayName': '菅井夏帆'},
            {'id': 'suzuki-rena', 'displayName': '鈴木玲名'},
            {'id': 'sekiguchi-rikako', 'displayName': '関口理香子'},
            {'id': 'tanaka-hana', 'displayName': '田中花'},
            {'id': 'tanabe-karin', 'displayName': '田邊果凜'},
            {'id': 'tani-seia', 'displayName': '谷聖彩'},
            {'id': 'tabata-nana', 'displayName': '田端那菜'},
            {'id': 'tabuchi-miu', 'displayName': '田淵美優'},
            {'id': 'nakamura-aoi', 'displayName': '中村葵'},
            {'id': 'nakamura-riro', 'displayName': '中村璃彩'},
            {'id': 'nakayama-honoka', 'displayName': '中山穗乃楓'},
            {'id': 'hamasaki-aiko', 'displayName': '濵嵜愛子'},
            {'id': 'bando-fuka', 'displayName': '坂東楓夏'},
            {'id': 'hosoi-ayaka', 'displayName': '細井彩加'},
            {'id': 'furuhashi-sayaka', 'displayName': '古橋沙也佳'},
            {'id': 'mogi-shion', 'displayName': '茂木詩音'},
            {'id': 'motohashi-meika', 'displayName': '本橋明桜'},
            {'id': 'moro-anon', 'displayName': '茂呂空音'},
            {'id': 'yamaguchi-misaki', 'displayName': '山口愛咲'},
            {'id': 'wakimoto-mihaya', 'displayName': '脇本美颯'},
            {'id': 'watanabe-miyu', 'displayName': '渡辺未優'},
        ],
    },

    'produce101-japan': {
        'query_template': 'PRODUCE 101 JAPAN {name} 自己紹介 1分PR',
        'expected_channel': 'PRODUCE 101 JAPAN 新世界',
        'contestants': [
            {'id': 'mamehara-issei', 'displayName': '豆原一成'},
            {'id': 'kawashiri-ren', 'displayName': '川尻蓮'},
            {'id': 'kawanishi-takumi', 'displayName': '川西拓実'},
            {'id': 'ohira-shosei', 'displayName': '大平祥生'},
            {'id': 'tsurubo-shion', 'displayName': '鶴房汐恩'},
            {'id': 'shiroiwa-ruki', 'displayName': '白岩瑠姫'},
            {'id': 'sato-keigo', 'displayName': '佐藤景瑚'},
            {'id': 'kimata-syoya', 'displayName': '木全翔也'},
            {'id': 'kono-junki', 'displayName': '河野純喜'},
            {'id': 'kinjo-sukai', 'displayName': '金城碧海'},
            {'id': 'yonashiro-sho', 'displayName': '與那城奨'},
        ],
    },

    'produce101-japan-s2': {
        'query_template': 'PRODUCE 101 JAPAN SEASON2 {name}',
        'expected_channel': 'PRODUCE 101 JAPAN 新世界',
        'contestants': [
            {'id': 'kimura-masaya', 'displayName': '木村柾哉'},
            {'id': 'takatsuka-hiromu', 'displayName': '髙塚大夢'},
            {'id': 'tajima-shogo', 'displayName': '田島将吾'},
            {'id': 'fujimaki-kyosuke', 'displayName': '藤牧京介'},
            {'id': 'ozaki-takumi', 'displayName': '尾崎匠海'},
            {'id': 'nishi-hiroto', 'displayName': '西洸人'},
            {'id': 'matsuda-jin', 'displayName': '松田迅'},
            {'id': 'xu-fengfan', 'displayName': '許豊凡'},
            {'id': 'ikezaki-rihito', 'displayName': '池﨑理人'},
            {'id': 'sano-yudai', 'displayName': '佐野雄大'},
            {'id': 'goto-takeru', 'displayName': '後藤威尊'},
        ],
    },

    'i-land': {
        'query_template': 'I-LAND {name} 글로벌 투표 PR 영상',
        'expected_channel': 'Mnet K-POP',
        'contestants': [
            {'id': 'yang-jungwon', 'displayName': '양정원'},
            {'id': 'lee-heeseung', 'displayName': '이희승'},
            {'id': 'park-jay', 'displayName': '박제이'},
            {'id': 'jake-sim', 'displayName': '제이크'},
            {'id': 'park-sunghoon', 'displayName': '박성훈'},
            {'id': 'kim-sunoo', 'displayName': '김선우'},
            {'id': 'nishimura-riki', 'displayName': '니키'},
            {'id': 'k', 'displayName': '케이'},
            {'id': 'daniel', 'displayName': '다니엘'},
            {'id': 'hanbin', 'displayName': '한빈'},
        ],
    },

    'girls-planet-999': {
        'query_template': 'Girls Planet 999 {name} PR 자기소개',
        'expected_channel': 'Mnet K-POP',
        'contestants': [
            {'id': 'kim-chaehyun', 'displayName': '김채현'},
            {'id': 'huening-bahiyyih', 'displayName': '휴닝바히에'},
            {'id': 'choi-yujin', 'displayName': '최유진'},
        ],
    },

    'produce-x-101': {
        'query_template': 'PRODUCE X 101 {name} 일대일아이컨택',
        'expected_channel': 'Mnet K-POP',
        'contestants': [
            {'id': 'kim-yohan', 'displayName': '김요한'},
            {'id': 'kim-wooseok', 'displayName': '김우석'},
            {'id': 'han-seungwoo', 'displayName': '한승우'},
        ],
    },
}


def search_youtube(query: str, max_results: int = 5) -> list[dict]:
    """YouTube検索を実行して動画リストを返す"""
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"ytsearch{max_results}:{query}", download=False)
        entries = info.get('entries', []) if info else []
        return [
            {
                'id': e.get('id'),
                'title': e.get('title', ''),
                'channel': e.get('uploader') or e.get('channel', ''),
            }
            for e in entries if isinstance(e, dict) and e.get('id')
        ]


def verify_channel_via_oembed(video_id: str) -> str | None:
    """oEmbedでチャンネル名を確認"""
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            return data.get('author_name')
    except Exception:
        return None


def collect_for_show(show_id: str, dry_run: bool = False) -> list[dict]:
    """番組の全参加者の動画IDを収集"""
    config = SHOW_CONFIGS.get(show_id)
    if not config:
        print(f"ERROR: Unknown show ID: {show_id}")
        return []

    query_template = config['query_template']
    expected_channel = config['expected_channel']
    contestants = config['contestants']

    results = []
    total = len(contestants)

    for i, contestant in enumerate(contestants, 1):
        name = contestant['displayName']
        contestant_id = contestant['id']
        query = query_template.format(name=name)

        print(f"[{i}/{total}] Searching: {name} ({contestant_id})")
        print(f"  Query: {query}")

        found_video_id = None
        found_channel = None
        found_title = None

        try:
            videos = search_youtube(query, max_results=5)

            for video in videos:
                vid_id = video.get('id')
                vid_channel = video.get('channel', '') or ''
                vid_title = video.get('title', '')

                # チャンネル名チェック（部分一致）
                if expected_channel.lower() in vid_channel.lower():
                    found_video_id = vid_id
                    found_channel = vid_channel
                    found_title = vid_title
                    break

            # 期待チャンネルで見つからなかった場合、最初の結果を仮採用
            if not found_video_id and videos:
                found_video_id = videos[0].get('id')
                found_channel = videos[0].get('channel', {}).get('name', '')
                found_title = videos[0].get('title', '')
                print(f"  WARNING: Expected channel not found. Using first result.")

        except Exception as e:
            print(f"  ERROR: Search failed: {e}")

        if found_video_id:
            print(f"  Found: {found_video_id} [{found_channel}]")
            print(f"  Title: {found_title}")
        else:
            print(f"  FAILED: No video found")

        result = {
            'id': contestant_id,
            'displayName': name,
            'videoId': found_video_id,
            'channel': found_channel,
            'title': found_title,
            'imageUrl': f"https://img.youtube.com/vi/{found_video_id}/hqdefault.jpg" if found_video_id else None,
        }
        results.append(result)

        # Rate limiting
        time.sleep(0.5)

    return results


def save_results(show_id: str, results: list[dict]):
    """結果をJSONファイルに保存"""
    output_file = f"scripts/youtube-ids-{show_id}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nSaved to: {output_file}")

    # サマリー表示
    found = sum(1 for r in results if r.get('videoId'))
    print(f"Results: {found}/{len(results)} found")

    failed = [r for r in results if not r.get('videoId')]
    if failed:
        print("\nFailed contestants:")
        for r in failed:
            print(f"  - {r['displayName']} ({r['id']})")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: uv run scripts/collect-youtube-ids.py <show-id>")
        print("\nAvailable shows:")
        for sid in SHOW_CONFIGS:
            n = len(SHOW_CONFIGS[sid]['contestants'])
            print(f"  {sid} ({n} contestants)")
        sys.exit(1)

    show_id = sys.argv[1]
    if show_id not in SHOW_CONFIGS:
        print(f"ERROR: Unknown show ID: {show_id}")
        print(f"Available: {list(SHOW_CONFIGS.keys())}")
        sys.exit(1)

    print(f"Collecting YouTube IDs for: {show_id}")
    print(f"Expected channel: {SHOW_CONFIGS[show_id]['expected_channel']}")
    print("=" * 60)

    results = collect_for_show(show_id)
    save_results(show_id, results)
