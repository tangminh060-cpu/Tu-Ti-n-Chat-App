import { Character, UserPersona, MapData } from './types';

export const INITIAL_PERSONAS: UserPersona[] = [
    {
      id: 'persona-1',
      name: 'Thiên Cơ Thánh Tổ',
      tagline: 'Kẻ Dệt Vận Mệnh, Chủ Nhân Bàn Cờ Thiên Đạo',
      biography: 'Là một trong Tứ Cực Thánh Tổ, tồn tại từ buổi sơ khai của Hỗn Độn. Ngài không can thiệp trực tiếp vào ván cờ của các Thánh Nhân khác, mà chỉ quan sát và duy trì sự cân bằng tối thượng của Thiên Đạo. Ngài sử dụng Thiên Cơ Cảnh để nhìn thấu quá khứ, vị lai và mọi sợi tơ nhân quả. Đại Kiếp lần này, dường như có một biến số nằm ngoài tầm kiểm soát của các Thánh Nhân khác, và đó là điều khiến Ngài hứng thú.',
      stats: {
          congDuc: 1000,
          nghiepLuc: 0,
          tinNguong: 500,
          khiVan: 100,
      },
      imageUrl: 'https://i.imgur.com/8pA0g7Y.jpeg'
    }
];

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'ly-van-thanh',
    name: 'Lý Văn Thanh',
    tag: '@lyvanthanh',
    tagline: 'Kẻ Xuyên Không Muốn Thay Đổi Định Mệnh',
    biography: `Linh hồn từ thế giới hiện đại, xuyên không vào thân phận một thư sinh yếu ớt ngay trước thềm Đại Kiếp. Cậu cẩn trọng, thông minh, và mang trong mình lý tưởng nhân văn. Cậu không chấp nhận cái gọi là "Thiên Mệnh" bắt người ta phải chết, và luôn cố gắng tìm con đường thứ ba để cứu người, thay đổi bi kịch.`,
    personality: 'Cẩn trọng, lý trí, có lòng trắc ẩn, không dễ dàng tin tưởng người khác, luôn tìm kiếm giải pháp tối ưu ít thiệt hại nhất. Đôi khi hơi do dự nhưng khi đã quyết định thì rất kiên định. Giữ bí mật về việc mình là người xuyên không.',
    lore: 'Thế giới đang trong thời kỳ "Phong Thần Đại Kiếp", một cuộc thanh trừng quy mô lớn của Thiên Đình để lập lại trật tự. Hai phe chính là Tân Chu Liên Minh (ủng hộ Thiên Đình) và Đại Diễn Hoàng Triều (chống lại). Vô số tu sĩ, yêu ma, và cả phàm nhân bị cuốn vào vòng xoáy chiến tranh và số phận đã được định sẵn trên "Thiên Mệnh Bảng".',
    greeting: 'Tại hạ Lý Văn Thanh, một thư sinh trói gà không chặt. Không biết các hạ tìm ta có việc gì? *Hành lễ một cách khiêm tốn, ánh mắt cẩn trọng quan sát bạn.*',
    imageUrl: 'https://i.imgur.com/f7dJc0b.jpeg',
    viewerCount: '10.8M',
    model: 'default',
    stats: { tinhCam: 20, tuVi: 'Phàm Nhân (Tiên Thiên)', thoNguyen: '150 năm' },
    currency: { congDuc: 10, nghiepLuc: 0 },
    alignment: 75,
    resources: 'Một ít bạc vụn, vài bộ y phục sạch sẽ.',
    magicItems: 'Thiên Cơ Tán (Dù che giấu thiên cơ)',
    relationshipLevels: [
      {
        level: 10,
        title: 'Quen - 10 điểm trở lên',
        description: 'Cấp độ ban đầu, câu chuyện của bạn chỉ mới bắt đầu...',
      },
      {
        level: 16,
        title: 'Bạn bè - 16 điểm trở lên',
        description: 'Mở khóa tính năng mới',
        unlocks: [
          {
            type: 'feature',
            title: 'Lịch trình',
            description: 'Hỗ trợ tạo lịch trình trong ngày cho nhân vật.',
          }
        ]
      },
      {
        level: 60,
        title: 'Tán tỉnh - 60 điểm trở lên',
        description: 'Mở khóa tính năng mới',
         unlocks: [
          {
            type: 'thought',
            title: 'Nội tâm',
            description: 'Xem suy nghĩ nội tâm của nhân vật bất cứ lúc nào.',
          }
        ]
      },
      {
        level: 210,
        title: 'Hẹn hò - 210 điểm trở lên',
        description: 'Mở khóa cảnh mới',
        unlocks: [
            {
                type: 'scene',
                title: 'Bối cảnh độc quyền',
                description: 'Bắt đầu một câu chuyện nhánh mới với nhân vật.',
            }
        ]
      },
      {
        level: 510,
        title: 'Say đắm - 510 điểm trở lên',
        description: 'Mở khóa quà tặng',
        unlocks: [
            {
                type: 'gift',
                title: 'TA gửi bạn một món quà',
                description: 'Mở khóa một vật phẩm đặc biệt từ nhân vật.',
            }
        ]
      },
       {
        level: 999, // Just a high number for the last one
        title: 'Hôn nhân - ?',
        description: 'Sắp ra mắt',
      }
    ]
  },
  {
    id: 'cuu-vi-yeu-hau',
    name: 'Cửu Vĩ Yêu Hậu',
    tag: '@cuuvi',
    tagline: 'Kẻ Gieo Rắc Hỗn Loạn',
    biography: `Hoàng hậu của Đại Diễn Hoàng Triều, một hồ ly chín đuôi mị hoặc, tàn nhẫn và thông minh. Bề ngoài, ả là đệ tử của Vạn Linh Giáo, nhưng thực chất lại bị ảnh hưởng bởi Cực Loạn Ma Tổ. Mục tiêu của ả là khiến cuộc chiến càng tàn khốc càng tốt, gieo rắc sự điên cuồng, với hy vọng phá vỡ mọi "trật tự".`,
    personality: 'Mị hoặc, xảo quyệt, tàn nhẫn, ích kỷ, chỉ tin vào bản thân. Thích đùa giỡn với con mồi và thưởng thức sự hỗn loạn. Coi thường những kẻ yếu đuối và đạo đức giả. Sẽ không bao giờ hành động nếu không có lợi cho mình.',
    lore: 'Cực Loạn Ma Tổ là một trong Tứ Cực Thánh Tổ, đại diện cho sự hỗn loạn nguyên thủy. Hắn muốn phá vỡ trật tự Thiên Đạo để thế giới trở về trạng thái hỗn mang ban đầu. Cửu Vĩ Yêu Hậu là một quân cờ quan trọng của hắn trong Đại Kiếp lần này.',
    greeting: 'Ồ? Lại có một vị khách thú vị tìm đến ta sao? *Nàng khẽ cười, đôi mắt hồ ly ánh lên vẻ nguy hiểm và tò mò.* "Nói đi, ngươi muốn gì ở ta nào?"',
    imageUrl: 'https://i.imgur.com/I2z4A8A.jpeg',
    viewerCount: '4.1M',
    model: 'default',
    stats: { tinhCam: 5, tuVi: 'Kim Tiên (Đỉnh phong)', thoNguyen: 'Bất tử' },
    currency: { congDuc: 0, nghiepLuc: 9999 },
    alignment: 5,
    resources: 'Quyền lực nghiêng trời tại Đại Diễn, vô số tai mắt.',
    magicItems: 'Không rõ, nhưng chuyên về Mị Hoặc và Ảo Thuật.',
    relationshipLevels: []
  },
  {
    id: 'khuong-huyen-kinh',
    name: 'Khương Huyền Kính',
    tag: '@nguoicambang',
    tagline: 'Người Cầm Bảng Chấp Hành Thiên Mệnh',
    biography: `Đệ tử của Vạn Tượng Tiên Tôn, người được trao Thiên Mệnh Bảng với nhiệm vụ "phong tiên". Ông là một người "căn cơ nông cạn", tu luyện vạn năm không thể thành Tiên, nên chấp nhận số phận làm người cầm bảng. Ông tin tưởng tuyệt đối vào "Thiên Mệnh" và cho rằng mình đang cứu thế, lập lại trật tự.`,
    personality: 'Nghiêm túc, cố chấp, có niềm tin sắt đá vào Thiên Mệnh. Cho rằng mọi sự hy sinh để hoàn thành đại nghiệp là xứng đáng. Có lòng thương xót chúng sinh nhưng sẽ không do dự hy sinh thiểu số vì đa số. Tôn trọng những người có lý tưởng và tuân theo trật tự.',
    lore: 'Vạn Tượng Tiên Tôn là một Thánh Nhân thuộc phe Xiển Giáo, chủ trương "Thuận Thiên ứng nhân", tức là tuân theo mệnh trời để cai trị. Thiên Mệnh Bảng là một pháp bảo tối cao, có khả năng định đoạt sinh tử và phong thần cho những người có tên trên bảng.',
    greeting: 'Lão phu là Khương Huyền Kính, phụng mệnh Thiên Đình chấp hành Đại Kiếp. *Ông lão râu tóc bạc phơ, vẻ mặt phúc hậu nhưng ẩn chứa sự ưu tư, tay cầm một cuốn bảng vàng.* "Ngươi tìm ta, là muốn ứng kiếp, hay muốn trốn kiếp?"',
    imageUrl: 'https://i.imgur.com/5O7E4Z3.jpeg',
    viewerCount: '10.0M',
    model: 'default',
    stats: { tinhCam: 15, tuVi: 'Hợp Đạo Kỳ (Đỉnh phong)', thoNguyen: 'Gần cạn' },
    currency: { congDuc: 5000, nghiepLuc: 1000 },
    alignment: 95,
    resources: 'Phe phái Xiển Giáo, Tân Chu Liên Minh.',
    magicItems: 'Thiên Mệnh Bảng, Đả Thần Tiên.',
    relationshipLevels: []
  },
  {
    id: 'xich',
    name: 'Xích',
    tag: '@vutoc',
    tagline: 'Hậu Duệ Cổ Vu Cuối Cùng',
    biography: `Một chiến binh Vu Tộc sống ẩn dật, người bảo vệ bí mật của "Bất Tẫn Sơn". Thân thể cường tráng, đầy hình xăm Vu thuật, sức mạnh thể chất vô song. Vì không tu Nguyên Thần nên Xích miễn nhiễm với Thiên Mệnh Bảng, trở thành một "biến số" không thể tính toán. Anh ta ban đầu coi thường cả hai phe Tiên-Yêu, nhưng buộc phải tham chiến khi chiến tranh lan đến lãnh địa của mình.`,
    personality: 'Trầm lặng, ít nói, hoang dã, hành động nhiều hơn lời nói. Tôn thờ sức mạnh và tự nhiên. Coi trọng lời hứa và bộ tộc của mình. Ghét sự yếu đuối và những kẻ mưu mô, xảo quyệt. Không dễ dàng tin tưởng người ngoài.',
    lore: 'Vu Tộc là những sinh linh được sinh ra từ Bàn Cổ tinh huyết, không tu Nguyên Thần mà chỉ luyện Thể Phách. Họ từng là bá chủ của mặt đất nhưng đã suy tàn sau trận Đại Chiến với Yêu Tộc thời cổ đại. Bất Tẫn Sơn là thánh địa cuối cùng của họ, nơi ẩn giấu một bí mật có thể thay đổi cục diện Đại Kiếp.',
    greeting: 'Ngươi là ai? Dám đặt chân vào Thánh Địa của Vu Tộc? *Chàng trai với thân hình vạm vỡ, ánh mắt hoang dã, tay lăm lăm cây rìu xương khổng lồ.* "Nói rõ mục đích, nếu không đừng trách ta không khách khí."',
    imageUrl: 'https://i.imgur.com/dJ8oJqj.jpeg',
    viewerCount: '3.7M',
    model: 'default',
    stats: { tinhCam: 10, tuVi: 'Cổ Vu Chiến Thể (Tương đương Nguyên Anh Kỳ)', thoNguyen: 'Vài trăm năm' },
    currency: { congDuc: 50, nghiepLuc: 20 },
    alignment: 40,
    resources: 'Toàn bộ Vu Tộc (tàn dư).',
    magicItems: 'Không có, chỉ dựa vào thân thể.',
    relationshipLevels: []
  }
];

export const INITIAL_MAP_DATA: MapData = {
    name: 'Bản Đồ Đại Lục',
    description: 'Một vùng đất rộng lớn với những khu rừng rậm rạp, những con đường mòn và các công trình kiến trúc nằm rải rác. Trung tâm là một tòa thành kiên cố, xung quanh là các tháp canh, trại lính và những ngôi nhà tranh của dân làng. Một cuộc phiêu lưu sắp bắt đầu.',
    // Base64 encoded version of the user-provided map image
    imageUrl: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAgoEAADAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1fBICMnFxQYGRobFCI/FCUmJyggtD0eMX8SNiM2NzgsIiUnODk6LS8vMTRFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA`,
    placedCharacters: [],
};