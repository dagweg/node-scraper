import unirest from "unirest";
import cheerio from "cheerio";
import fs from "fs";

function getUserAgent() {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.151 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3429.157 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4464.110 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4464.45 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4592.71 Safari/537.36",
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

async function getData() {
  let page = 0; // increment by 10 every time

  const data = [];
  let header = {
    "User-Agent": getUserAgent(),
  };

  while (page < 200) {
    let url = `https://www.google.com/search?q=javascript&sca_esv=ba4285711e6d1a2d&sca_upv=1&gl=us&hl=en&sxsrf=ADLYWII5p76JlWLEspSE4lQeJCBOamyZ-w:1721512109289&ei=rTCcZuipEeeE7M8Ps5u02AQ&start=${page}&sa=N&sstk=AagrsuhBt6J-wfXXjV70onCMrnrapj1iQB-NbwZ-jxkHBRqv2wZ_T35xmvFp3XzCldZlxLUP6kq-eNl_jqm9tlLok5w9kAMrS1G2S-l4tUhKvUkhF87m66_H4AqbUqHs-iSPCJ7i3jW4V6Z11zrQTFu0EEHHgOWxwKEQ7OkICNahGe1N8NqExuRA4fNg_hZGvw&ved=2ahUKEwiotICuzLaHAxVnAvsDHbMNDUs4HhDy0wN6BAgEEAs&biw=2292&bih=675&dpr=0.83`;

    try {
      let response = await unirest.get(url).headers(header);
      const $ = cheerio.load(response.body);

      $("#rso .g").each((i, el) => {
        const curData = {
          title: $(el).find("h3").text(),
          link: $(el).find("a").attr("href"),
          description: $(el).find(".VwiC3b").text(),
        };
        data.push(curData);

        fs.appendFile(
          "scraped-data.json",
          `,\n${JSON.stringify(curData)}`,
          (err) => {
            if (err) throw err;
          }
        );
      });
    } catch (error) {
      console.error(`Error fetching page ${page / 10 + 1}:`, error);
    }

    page += 10;
  }
  // console.log(data);
  console.log(data);
}
getData();
