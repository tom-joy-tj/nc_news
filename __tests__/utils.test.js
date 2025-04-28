const {
  convertTimestampToDate, 
  createRef
} = require("../db/seeds/utils");

describe.skip("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });

  describe.skip( "testing the new utils function createRef" , () => {
    test( "test1 - createRef should take empty array and return empty object", () => {
      const input = []
      const result = createRef(input)
      expect(result).toEqual({})
    })
    test( "test2 - createRef should return a ref object with single key:value when passed an array with single nested object", () => {
      const input = [{
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        created_at: "2020-07-09T20:11:00.000Z",
        body: 'I find this existence challenging',
        votes: 100,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }]
      const result = createRef(input)
      expect(result).toEqual({"Living in the shadow of a great man": 1})
    })
    test( "test3 - createRef should return a ref object with multiple key:value pairs when passed an array with multiple nested objects", () => {
      const input = [{
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        created_at: "2020-07-09T20:11:00.000Z",
        body: 'I find this existence challenging',
        votes: 100,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      },
      {
        article_id: 4,
        title: 'Going to the shops',
        topic: 'mitch',
        author: 'butter_bridge',
        created_at: "2020-07-09T20:11:00.000Z",
        body: 'I find this existence challenging',
        votes: 100,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      } 
    ]
      const result = createRef(input)
      expect(result).toEqual({"Living in the shadow of a great man": 1, "Going to the shops": 4})
    })
  })
});

