"""
Hệ Thống Đồng Nghĩa Tiếng Việt
Cải thiện độ chính xác matching cho đầu vào tiếng Việt bằng đồng nghĩa và biến thể
"""

# Từ điển đồng nghĩa y khoa tiếng Việt toàn diện
VIETNAMESE_SYNONYMS = {
    # HÔ HẤP
    'ho': ['ho', 'ho khan', 'ho có đờm', 'ho ra máu', 'ho dai dẳng', 'ho lâu ngày', 'ho nhẹ', 'ho nặng'],
    'khó thở': ['khó thở', 'thở khó', 'hụt hơi', 'thở nhanh', 'thở gấp', 'khó đi', 'ngạt thở', 'thở dốc'],
    'khò khè': ['khò khè', 'thở khò khè', 'thở rít', 'thở có tiếng'],
    'nấc cụt': ['nấc cụt', 'nấc'],
    'hắt hơi': ['hắt hơi', 'hắt xì'],
    'chảy máu mũi': ['chảy máu mũi', 'chảy máu cam', 'máu cam'],
    
    # TIM MẠCH
    'đau ngực': ['đau ngực', 'đau vùng ngực', 'tức ngực', 'nặng ngực', 'đau tim', 'đau thắt ngực'],
    'nhịp tim nhanh': ['nhịp tim nhanh', 'tim đập nhanh', 'đánh trống ngực', 'hồi hộp', 'tim nhanh'],
    'nhịp tim chậm': ['nhịp tim chậm', 'tim đập chậm', 'tim chậm'],
    'phù nề': ['phù', 'phù nề', 'sưng phù', 'phù chân', 'phù mắt'],
    
    # THẦN KINH
    'đau đầu': ['đau đầu', 'nhức đầu', 'đau nửa đầu', 'đau đầu dữ dội', 'đau đầu nhẹ', 'nhức đầu', 'đau đầu kinh niên'],
    'chóng mặt': ['chóng mặt', 'hoa mắt', 'choáng váng', 'xây xẩm', 'mắt hoa', 'đứng không vững'],
    'co giật': ['co giật', 'giật mình', 'giật cơ', 'co cứng'],
    'run': ['run', 'run tay', 'run chân', 'run người', 'tay run'],
    'tê': ['tê', 'tê bì', 'tê liệt', 'tê tay', 'tê chân', 'mất cảm giác'],
    'hôn mê': ['hôn mê', 'bất tỉnh', 'mất ý thức', 'ngất', 'ngất xỉu'],
    'mất trí nhớ': ['mất trí nhớ', 'quên', 'hay quên', 'mất trí'],
    
    # TIÊU HÓA
    'đau bụng': ['đau bụng', 'đau quặn bụng', 'đau bụng dưới', 'đau bụng trên', 'bụng đau', 'cứng bụng', 'mỏi bụng'],
    'buồn nôn': ['buồn nôn', 'nôn', 'ói', 'nôn mửa', 'nôn ra', 'ói mửa', 'muốn nôn'],
    'tiêu chảy': ['tiêu chảy', 'ỉa chảy', 'đi lỏng', 'đi ngoài nhiều lần'],
    'táo bón': ['táo bón', 'khó đi ngoài', 'đại tiện khó', 'đi ngoài khó'],
    'ợ nóng': ['ợ nóng', 'ợ hơi', 'ợ chua', 'trào ngược'],
    'khó nuốt': ['khó nuốt', 'nuốt khó', 'nuốt đau', 'đau khi nuốt'],
    'đầy hơi': ['đầy hơi', 'đầy bụng', 'bụng đầy', 'bụng phình', 'chướng bụng'],
    'vàng da': ['vàng da', 'da vàng', 'vàng mắt'],
    
    # CƠ XƯƠNG KHỚP
    'đau lưng': ['đau lưng', 'đau thắt lưng', 'nhức lưng', 'đau cột sống'],
    'đau khớp': ['đau khớp', 'đau xương khớp', 'nhức khớp', 'khớp đau'],
    'đau cơ': ['đau cơ', 'nhức cơ', 'cơ đau', 'đau nhức toàn thân'],
    'gãy xương': ['gãy xương', 'gẫy xương', 'xương gãy'],
    'chuột rút': ['chuột rút', 'chuột rút cơ', 'co thắt'],
    
    # DA LIỄU
    'phát ban': ['phát ban', 'nổi mẩn', 'nổi ban', 'nổi mề đay', 'mẩn đỏ', 'ban đỏ'],
    'ngứa': ['ngứa', 'ngứa ngáy', 'ngứa da', 'ngứa khắp người'],
    'sưng': ['sưng', 'sưng phù', 'phù', 'sưng to'],
    
    # TAI MŨI HỌNG
    'đau họng': ['đau họng', 'họng đau', 'đau cổ họng', 'đau rát họng', 'họng khô'],
    'nghẹt mũi': ['nghẹt mũi', 'tắc mũi', 'ngạt mũi', 'mũi bị nghẹt'],
    'đau tai': ['đau tai', 'nhức tai', 'tai đau', 'ù tai', 'điếc tai'],
    'khàn giọng': ['khàn giọng', 'khàn tiếng', 'khàn', 'mất tiếng'],
    
    # TIẾT NIỆU
    'đau khi đi tiểu': ['đau khi đi tiểu', 'tiểu buốt', 'đái buốt', 'tiểu đau', 'đi tiểu đau'],
    'tiểu máu': ['tiểu máu', 'đái máu', 'nước tiểu có máu'],
    'bí tiểu': ['bí tiểu', 'không tiểu được', 'khó tiểu', 'tiểu khó'],
    'đi tiểu nhiều': ['đi tiểu nhiều', 'tiểu nhiều lần', 'tiểu rắt', 'tiểu liên tục'],
    
    # CHUNG
    'sốt': ['sốt', 'nóng người', 'có sốt', 'sốt cao', 'sốt nhẹ', 'sốt thấp', 'sốt lâm râm'],
    'mệt mỏi': ['mệt mỏi', 'mệt', 'mỏi', 'uể oải', 'mệt lử', 'kiệt sức', 'yếu người'],
    'chán ăn': ['chán ăn', 'không thèm ăn', 'biếng ăn', 'kém ăn', 'mất cảm giác ăn'],
    'giảm cân': ['giảm cân', 'sút cân', 'gầy', 'gầy sút', 'sụt ký'],
    'sốc': ['sốc', 'choáng', 'ngất', 'suy tuần hoàn'],
    
    # TÂM LÝ/TÂM THẦN
    'lo âu': ['lo âu', 'lo lắng', 'bồn chồn', 'căng thẳng', 'stress', 'âu lo'],
    'trầm cảm': ['trầm cảm', 'buồn chán', 'chán nản', 'mất hứng thú'],
    'mất ngủ': ['mất ngủ', 'khó ngủ', 'không ngủ được', 'ngủ không ngon'],
}

# Hàm mở rộng đầu vào người dùng với từ đồng nghĩa
def expand_with_synonyms(text):
    """
    Mở rộng văn bản tiếng Việt với từ đồng nghĩa để matching tốt hơn
    Ví dụ: 'ho khan' → ['ho', 'ho khan', 'ho có đờm', ...]
    """
    text_lower = text.lower().strip()
    expanded_terms = [text_lower]
    
    # Kiểm tra xem có nhóm đồng nghĩa nào khớp không
    for main_term, synonyms in VIETNAMESE_SYNONYMS.items():
        for synonym in synonyms:
            if synonym in text_lower or text_lower in synonym:
                # Thêm tất cả từ đồng nghĩa từ nhóm này
                expanded_terms.extend(synonyms)
                break
    
    # Loại bỏ trùng lặp
    return list(set(expanded_terms))


if __name__ == '__main__':
    # Demo
    print("\n" + "=" * 100)
    print("DEMO HỆ THỐNG ĐỒNG NGHĨA TIẾNG VIỆT")
    print("=" * 100)
    
    test_inputs = [
        'ho khan',
        'đau đầu dữ dội',
        'buồn nôn và đau bụng',
        'tim đập nhanh',
        'khó thở',
    ]
    
    for input_text in test_inputs:
        expanded = expand_with_synonyms(input_text)
        print(f"\nĐầu vào: '{input_text}'")
        print(f"Mở rộng thành {len(expanded)} từ:")
        for term in expanded[:5]:
            print(f"  • {term}")
        if len(expanded) > 5:
            print(f"  ... và {len(expanded)-5} từ khác")
    
    print("\n" + "=" * 100)
    print(f"Tổng số nhóm đồng nghĩa: {len(VIETNAMESE_SYNONYMS)}")
    print(f"Tổng số mục đồng nghĩa: {sum(len(v) for v in VIETNAMESE_SYNONYMS.values())}")
    print("=" * 100)
