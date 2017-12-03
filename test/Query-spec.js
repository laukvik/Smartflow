import {Query} from '../src/Query';

describe('Query', () => {

  const json = {
    "galleryTitle": "Photo of the Day",
    "previousEndpoint": "/content/photography/en_US/photo-of-the-day/_jcr_content/.gallery.2017-10.json",
    "items": [{
      "title": "Desert Oases",
      "caption": "<p>The Al Qudra oases are manmade lakes approximately a 30-minute drive from Dubai, United Arab Emirates. The lakes are home to desert wildlife, and upwards of 100 different species of birds.<\/p>\n",
      "credit": "Ghadir Shaar",
      "profileUrl": "https://yourshot.nationalgeographic.com/profile/1075436/",
      "altText": "Picture of manmade lakes in a desert outside of Dubai",
      "full-path-url": "https://yourshot.nationalgeographic.com/photos/10967222/",
      "url": "https://yourshot.nationalgeographic.com",
      "originalUrl": "/u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDNebW2EVuW0TXZw2oRW8QW09UJmpYgFPFsVZtVwcFD3T7mXxOKTVnFQVRdyrixC1NkxaMLG3H-mVpyg_D0rM0YYYTWTXtGAxp_KuiXagJL8PcNHYERp8700dqOHrl9Yb4mujUP8DBkwCZvuSLwRdLz0o4BzBlrQ7dzkVNilAN2TihCj_g/",
      "aspectRatio": 0.459834440946718,
      "sizes": {
        "320": "/u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDNebW2EVuW0TXZw2oRW8QW09UJmpYgFPFsVZtVwcFD3T7mXxOKTVnFQVRdyrixC1NkxaMLG3H-mVpyg_D0rM0YYYTWTXtGAxp_KuiXagJL8PcNHYERp8700dqOHrl9Yb4mujUP8DBkwCZvuSLwRdLcBO47gL2jS5g5qBA0oQiUychQ/",
        "1600": "/u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDNebW2EVuW0TXZw2oRW8QW09UJmpYgFPFsVZtVwcFD3T7mXxOKTVnFQVRdyrixC1NkxaMLG3H-mVpyg_D0rM0YYYTWTXtGAxp_KuiXagJL8PcNHYERp8700dqOHrl9Yb4mujUP8DBkwCZvuSLwRdLWNRVLXdptsxIKw-Wq9gxQuvhPv/",
        "640": "/u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDNebW2EVuW0TXZw2oRW8QW09UJmpYgFPFsVZtVwcFD3T7mXxOKTVnFQVRdyrixC1NkxaMLG3H-mVpyg_D0rM0YYYTWTXtGAxp_KuiXagJL8PcNHYERp8700dqOHrl9Yb4mujUP8DBkwCZvuSLwRdLLNZY8S16ao4_knHoVoEEKeWsY/",
        "2048": "/u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDNebW2EVuW0TXZw2oRW8QW09UJmpYgFPFsVZtVwcFD3T7mXxOKTVnFQVRdyrixC1NkxaMLG3H-mVpyg_D0rM0YYYTWTXtGAxp_KuiXagJL8PcNHYERp8700dqOHrl9Yb4mujUP8DBkwCZvuSLwRdLaARR2DGCePGX5dz01FX-EMs8g3/",
        "500": "/u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDNebW2EVuW0TXZw2oRW8QW09UJmpYgFPFsVZtVwcFD3T7mXxOKTVnFQVRdyrixC1NkxaMLG3H-mVpyg_D0rM0YYYTWTXtGAxp_KuiXagJL8PcNHYERp8700dqOHrl9Yb4mujUP8DBkwCZvuSLwRdLGHZhwdYhdhWonAigM_iItSwd8/",
        "1024": "/u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDNebW2EVuW0TXZw2oRW8QW09UJmpYgFPFsVZtVwcFD3T7mXxOKTVnFQVRdyrixC1NkxaMLG3H-mVpyg_D0rM0YYYTWTXtGAxp_KuiXagJL8PcNHYERp8700dqOHrl9Yb4mujUP8DBkwCZvuSLwRdLWL5CUX-tEcthr8GmggBoHeuElD/",
        "800": "/u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDNebW2EVuW0TXZw2oRW8QW09UJmpYgFPFsVZtVwcFD3T7mXxOKTVnFQVRdyrixC1NkxaMLG3H-mVpyg_D0rM0YYYTWTXtGAxp_KuiXagJL8PcNHYERp8700dqOHrl9Yb4mujUP8DBkwCZvuSLwRdLzx5fdpOOEemr_qblGOZuQHWYg/",
        "240": "/u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDNebW2EVuW0TXZw2oRW8QW09UJmpYgFPFsVZtVwcFD3T7mXxOKTVnFQVRdyrixC1NkxaMLG3H-mVpyg_D0rM0YYYTWTXtGAxp_KuiXagJL8PcNHYERp8700dqOHrl9Yb4mujUP8DBkwCZvuSLwRdLaEHmkzJFh4KKItYQficBLpkYQ/"
      }
    }]
  };

  describe('find', () => {
    it('should find root', () => {
      expect(Query.find("/", json)).toBe(json);
    });

    it('should find second level', () => {
      expect(Query.find("/items", json)).toBe(json.items);
    });

    it('should find second level', () => {
      expect(Query.find("/items/sizes", json)).toBe(json.items.sizes);
    });
    it('should find third level', () => {
      expect(Query.find("/items/sizes", json)).toBe(json.items.sizes);
    });

    it('should not find anything', () => {
      expect(Query.find("/a", json)).toBeUndefined();
    });
    // it('should not find anything2', () => {
    //   expect(Query.find("/a/b", json)).toBeUndefined();
    // });
  });

});
