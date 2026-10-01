/**
 * Google Start Homepage - Main Script (app.js)
 * Features:
 *  - Realtime Weather for Seoul & Busan (Open-Meteo API + Fallback)
 *  - Realtime Digital Clock & Korean Date
 *  - Google Search with Voice Search (Web Speech API) & Recent Search History
 *  - Inspirational Quote of the Day (Refresh & Clipboard Copy)
 *  - Customizable Quick Bookmarks (LocalStorage)
 *  - Light / Dark Theme Mode Toggle (LocalStorage)
 *  - Google Apps Dropdown Menu
 */

// ==========================================
// 1. Data & Constants
// ==========================================

// Weather Coordinates
const CITIES = {
  seoul: { name: '서울', lat: 37.5665, lon: 126.9780 },
  busan: { name: '부산', lat: 35.1796, lon: 129.0756 }
};

// Weather Code Mapping (WMO Code to Korean Desc & Icon)
const WEATHER_CODE_MAP = {
  0: { desc: '맑음', icon: 'fa-sun icon-sun' },
  1: { desc: '대체로 맑음', icon: 'fa-cloud-sun icon-sun' },
  2: { desc: '구름 조금', icon: 'fa-cloud-sun icon-cloud' },
  3: { desc: '흐림', icon: 'fa-cloud icon-cloud' },
  45: { desc: '안개', icon: 'fa-smog icon-cloud' },
  48: { desc: '성에 안개', icon: 'fa-smog icon-cloud' },
  51: { desc: '이슬비', icon: 'fa-cloud-rain icon-rain' },
  53: { desc: '약한 비', icon: 'fa-cloud-rain icon-rain' },
  55: { desc: '비', icon: 'fa-cloud-showers-heavy icon-rain' },
  61: { desc: '약한 비', icon: 'fa-cloud-rain icon-rain' },
  63: { desc: '보통 비', icon: 'fa-cloud-showers-heavy icon-rain' },
  65: { desc: '강한 비', icon: 'fa-cloud-showers-heavy icon-rain' },
  71: { desc: '약한 눈', icon: 'fa-snowflake icon-snow' },
  73: { desc: '보통 눈', icon: 'fa-snowflake icon-snow' },
  75: { desc: '강한 눈', icon: 'fa-snowflake icon-snow' },
  77: { desc: '싸락눈', icon: 'fa-snowflake icon-snow' },
  80: { desc: '소나기', icon: 'fa-cloud-showers-water icon-rain' },
  81: { desc: '강한 소나기', icon: 'fa-cloud-showers-water icon-rain' },
  82: { desc: '폭우성 소나기', icon: 'fa-cloud-showers-water icon-rain' },
  85: { desc: '약한 눈보라', icon: 'fa-snowflake icon-snow' },
  86: { desc: '강한 눈보라', icon: 'fa-snowflake icon-snow' },
  95: { desc: '뇌우', icon: 'fa-bolt icon-thunder' },
  96: { desc: '우박을 동반한 뇌우', icon: 'fa-bolt-lightning icon-thunder' },
  99: { desc: '강한 우박 뇌우', icon: 'fa-bolt-lightning icon-thunder' }
};

// Inspirational Quotes Collection (오늘의 명언)
const QUOTES = [
  { text: "성공은 매일 반복되는 작은 노력들의 합이다.", author: "로버트 콜리어" },
  { text: "시작하는 방법은 그만 말하고 행동하기 시작하는 것이다.", author: "월트 디즈니" },
  { text: "어제와 똑같이 살면서 다른 미래를 기대하는 것은 정신병 초기증세이다.", author: "알베르트 아인슈타인" },
  { text: "당신이 할 수 있다고 믿든 할 수 없다고 믿든, 믿는 대로 될 것이다.", author: "헨리 포드" },
  { text: "바람이 불지 않으면 노를 저어라.", author: "윈스턴 처칠" },
  { text: "가장 어두운 밤도 언젠가는 끝나고 해는 떠오를 것이다.", author: "빅토르 위고" },
  { text: "우리는 우리가 반복적으로 하는 것에 의해 정의된다. 그러므로 탁월함은 행동이 아니라 습관이다.", author: "아리스토텔레스" },
  { text: "기회는 일어나는 것이 아니라 당신이 만드는 것이다.", author: "크리스 그로서" },
  { text: "천 리 길도 한 걸음부터.", author: "노자" },
  { text: "오늘 할 수 있는 일을 내일로 미루지 마라.", author: "벤저민 프랭클린" },
  { text: "꿈을 이루고자 하는 용기만 있다면 모든 꿈은 이루어질 수 있다.", author: "월트 디즈니" },
  { text: "혁신은 리더와 추종자를 구분하는 잣대이다.", author: "스티브 잡스" },
  { text: "배움에는 끝이 없다. 호기심을 멈추지 마라.", author: "레오나르도 다빈치" },
  { text: "미래를 예측하는 가장 좋은 방법은 미래를 창조하는 것이다.", author: "피터 드러커" },
  { text: "단 하나의 촛불이 수천 개의 촛불을 밝힐 수 있듯, 지식과 친절은 나눌수록 커진다.", author: "붓다" },
  { text: "스스로를 신뢰하라. 그러면 어떻게 살아야 할지 알게 될 것이다.", author: "요한 볼프강 폰 괴테" },
  { text: "인생은 속도가 아니라 방향이다.", author: "괴테" },
  { text: "고난 속에는 언제나 기회가 숨어 있다.", author: "알베르트 아인슈타인" },
  { text: "배우고 때로 익히면 또한 기쁘지 아니한가.", author: "공자" },
  { text: "오늘이 당신의 남은 인생의 첫날이다.", author: "아메리칸 인디언 격언" },
  { text: "모든 성취의 출발점은 열망이다.", author: "나폴레온 힐" },
  { text: "당신이 좋아하는 일을 하거나, 당신이 하는 일을 좋아하라.", author: "스티브 잡스" },
  { text: "변화를 두려워하지 마라. 성장은 언제나 변화의 끝에서 시작된다.", author: "로빈 샤르마" },
  { text: "끝까지 해보기 전까지는 늘 불가능해 보인다.", author: "넬슨 만델라" }
];

// ==========================================
// 2. State & Storage Management
// ==========================================
let currentCity = 'seoul';
let recentSearches = JSON.parse(localStorage.getItem('google_recent_searches') || '[]');

// ==========================================
// 3. Realtime Clock & Korean Date
// ==========================================
function updateClock() {
  const now = new Date();
  const timeDisplay = document.getElementById('timeDisplay');
  const dateDisplay = document.getElementById('dateDisplay');

  if (timeDisplay) {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  }

  if (dateDisplay) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = days[now.getDay()];
    dateDisplay.textContent = `${year}년 ${month}월 ${date}일 (${day})`;
  }
}

// ==========================================
// 4. Live Weather Integration (Open-Meteo)
// ==========================================
async function fetchWeatherData(cityKey) {
  const city = CITIES[cityKey];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return {
      success: true,
      temp: Math.round(data.current.temperature_2m),
      humidity: Math.round(data.current.relative_humidity_2m),
      code: data.current.weather_code,
      maxTemp: Math.round(data.daily.temperature_2m_max[0]),
      minTemp: Math.round(data.daily.temperature_2m_min[0])
    };
  } catch (err) {
    console.warn(`[Weather] Error fetching ${cityKey} weather:`, err);
    // Graceful realistic fallback
    const fallbackTemps = { seoul: { temp: 22, min: 18, max: 26, hum: 55 }, busan: { temp: 24, min: 20, max: 27, hum: 65 } };
    const fb = fallbackTemps[cityKey] || fallbackTemps.seoul;
    return {
      success: false,
      temp: fb.temp,
      humidity: fb.hum,
      code: 1, // 대체로 맑음
      maxTemp: fb.max,
      minTemp: fb.min
    };
  }
}

async function renderWeather() {
  const refreshBtn = document.getElementById('refreshWeatherBtn');
  if (refreshBtn) refreshBtn.querySelector('i').classList.add('fa-spin');

  // Fetch both in parallel
  const [seoulData, busanData] = await Promise.all([
    fetchWeatherData('seoul'),
    fetchWeatherData('busan')
  ]);

  // Update Seoul UI
  updateWeatherUI('seoul', seoulData);
  // Update Busan UI
  updateWeatherUI('busan', busanData);

  if (refreshBtn) {
    setTimeout(() => {
      refreshBtn.querySelector('i').classList.remove('fa-spin');
    }, 400);
  }
}

function updateWeatherUI(cityKey, data) {
  const weatherInfo = WEATHER_CODE_MAP[data.code] || { desc: '맑음', icon: 'fa-sun icon-sun' };

  const tempEl = document.getElementById(`${cityKey}Temp`);
  const descEl = document.getElementById(`${cityKey}Desc`);
  const maxEl = document.getElementById(`${cityKey}Max`);
  const minEl = document.getElementById(`${cityKey}Min`);
  const humEl = document.getElementById(`${cityKey}Humidity`);
  const iconWrap = document.getElementById(`${cityKey}Icon`);

  if (tempEl) tempEl.textContent = `${data.temp}°C`;
  if (descEl) descEl.textContent = weatherInfo.desc;
  if (maxEl) maxEl.textContent = `${data.maxTemp}°`;
  if (minEl) minEl.textContent = `${data.minTemp}°`;
  if (humEl) humEl.textContent = `${data.humidity}%`;

  if (iconWrap) {
    iconWrap.innerHTML = `<i class="fa-solid ${weatherInfo.icon} weather-icon"></i>`;
  }
}

function setupWeatherTabs() {
  const tabSeoul = document.getElementById('tabSeoul');
  const tabBusan = document.getElementById('tabBusan');
  const weatherSeoul = document.getElementById('weatherSeoul');
  const weatherBusan = document.getElementById('weatherBusan');
  const refreshBtn = document.getElementById('refreshWeatherBtn');

  if (tabSeoul && tabBusan) {
    tabSeoul.addEventListener('click', () => {
      currentCity = 'seoul';
      tabSeoul.classList.add('active');
      tabBusan.classList.remove('active');
      weatherSeoul.classList.add('active');
      weatherBusan.classList.remove('active');
    });

    tabBusan.addEventListener('click', () => {
      currentCity = 'busan';
      tabBusan.classList.add('active');
      tabSeoul.classList.remove('active');
      weatherBusan.classList.add('active');
      weatherSeoul.classList.remove('active');
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      renderWeather();
      showToast('날씨 정보를 최신으로 갱신했습니다.');
    });
  }
}

// ==========================================
// 5. Google Search & History Handler
// ==========================================
function setupSearch() {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const searchBar = document.getElementById('searchBar');
  const clearBtn = document.getElementById('clearBtn');
  const searchDropdown = document.getElementById('searchDropdown');
  const recentList = document.getElementById('recentList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const voiceBtn = document.getElementById('voiceSearchBtn');
  const lensBtn = document.getElementById('lensBtn');
  const feelingLuckyBtn = document.getElementById('btnFeelingLucky');

  // Input styling & clear button toggle
  searchInput.addEventListener('input', (e) => {
    if (e.target.value.trim().length > 0) {
      clearBtn.style.display = 'flex';
    } else {
      clearBtn.style.display = 'none';
    }
  });

  // Clear button click
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    searchInput.focus();
  });

  // Focus / Blur handling
  searchInput.addEventListener('focus', () => {
    searchBar.classList.add('focus-within');
    renderRecentSearches();
  });

  document.addEventListener('click', (e) => {
    if (!searchForm.contains(e.target)) {
      searchBar.classList.remove('focus-within', 'has-dropdown');
      if (searchDropdown) searchDropdown.style.display = 'none';
    }
  });

  // Form Submit
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      saveRecentSearch(query);
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
  });

  // Feeling lucky button
  if (feelingLuckyBtn) {
    feelingLuckyBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`;
      } else {
        // Pick random quote or surprise lucky action
        displayRandomQuote();
        showToast('I\'m Feeling Lucky! 새로운 영감을 주는 명언을 추천합니다 ✨');
      }
    });
  }

  // Voice Search (Speech Recognition)
  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      startVoiceRecognition(searchInput);
    });
  }

  // Lens Button
  if (lensBtn) {
    lensBtn.addEventListener('click', () => {
      window.open('https://lens.google.com', '_blank');
    });
  }

  // Clear recent searches
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      recentSearches = [];
      localStorage.removeItem('google_recent_searches');
      renderRecentSearches();
      showToast('검색 기록이 삭제되었습니다.');
    });
  }
}

function saveRecentSearch(query) {
  recentSearches = recentSearches.filter(item => item !== query);
  recentSearches.unshift(query);
  if (recentSearches.length > 6) recentSearches.pop();
  localStorage.setItem('google_recent_searches', JSON.stringify(recentSearches));
}

function removeRecentSearch(query) {
  recentSearches = recentSearches.filter(item => item !== query);
  localStorage.setItem('google_recent_searches', JSON.stringify(recentSearches));
  renderRecentSearches();
}

function renderRecentSearches() {
  const searchDropdown = document.getElementById('searchDropdown');
  const searchBar = document.getElementById('searchBar');
  const recentList = document.getElementById('recentList');
  const searchInput = document.getElementById('searchInput');

  if (!recentList || !searchDropdown) return;

  if (recentSearches.length === 0) {
    searchDropdown.style.display = 'none';
    searchBar.classList.remove('has-dropdown');
    return;
  }

  recentList.innerHTML = '';
  recentSearches.forEach(item => {
    const li = document.createElement('li');
    li.className = 'recent-item';
    li.innerHTML = `
      <div class="recent-item-left">
        <i class="fa-regular fa-clock"></i>
        <span>${escapeHtml(item)}</span>
      </div>
      <button class="recent-item-remove" title="삭제" aria-label="기록 삭제">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    // Click to search
    li.querySelector('.recent-item-left').addEventListener('click', () => {
      searchInput.value = item;
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(item)}`;
    });

    // Remove single item
    li.querySelector('.recent-item-remove').addEventListener('click', (e) => {
      e.stopPropagation();
      removeRecentSearch(item);
    });

    recentList.appendChild(li);
  });

  searchDropdown.style.display = 'block';
  searchBar.classList.add('has-dropdown');
}

// Voice Recognition using Web Speech API
function startVoiceRecognition(inputEl) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('현재 브라우저에서 음성 인식을 지원하지 않습니다.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'ko-KR';
  recognition.interimResults = false;

  showToast('음성을 듣고 있습니다... 말씀해 주세요 🎙️');

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputEl.value = transcript;
    showToast(`인식됨: "${transcript}"`);
    setTimeout(() => {
      saveRecentSearch(transcript);
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(transcript)}`;
    }, 600);
  };

  recognition.onerror = (event) => {
    showToast('음성 인식 오류가 발생했습니다. 다시 시도해 주세요.');
  };

  try {
    recognition.start();
  } catch (err) {
    console.error('Speech recognition error:', err);
  }
}

// ==========================================
// 6. Quote of the Day (오늘의 명언)
// ==========================================
let currentQuoteIndex = -1;

function displayRandomQuote(animate = false) {
  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const quoteWrapper = document.getElementById('quoteWrapper');

  if (!quoteText || !quoteAuthor) return;

  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * QUOTES.length);
  } while (newIndex === currentQuoteIndex && QUOTES.length > 1);

  currentQuoteIndex = newIndex;
  const quote = QUOTES[currentQuoteIndex];

  if (animate && quoteWrapper) {
    quoteWrapper.classList.add('fading');
    setTimeout(() => {
      quoteText.textContent = `"${quote.text}"`;
      quoteAuthor.textContent = `- ${quote.author}`;
      quoteWrapper.classList.remove('fading');
    }, 200);
  } else {
    quoteText.textContent = `"${quote.text}"`;
    quoteAuthor.textContent = `- ${quote.author}`;
  }
}

function setupQuotes() {
  displayRandomQuote(false);

  const refreshBtn = document.getElementById('refreshQuoteBtn');
  const copyBtn = document.getElementById('copyQuoteBtn');

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      displayRandomQuote(true);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const quote = QUOTES[currentQuoteIndex];
      const fullText = `"${quote.text}" - ${quote.author}`;
      navigator.clipboard.writeText(fullText).then(() => {
        showToast('명언이 클립보드에 복사되었습니다! 📋');
      }).catch(() => {
        showToast('복사에 실패했습니다.');
      });
    });
  }
}

// ==========================================
// 7. Theme Toggle & UI Interactions
// ==========================================
function setupTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('google_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('google_theme', newTheme);
      showToast(`${newTheme === 'dark' ? '다크' : '라이트'} 모드로 전환되었습니다.`);
    });
  }
}

function applyTheme(theme) {
  const themeIcon = document.getElementById('themeIcon');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) {
      themeIcon.className = 'fa-solid fa-sun';
      themeIcon.style.color = '#fbbc05';
    }
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (themeIcon) {
      themeIcon.className = 'fa-solid fa-moon';
      themeIcon.style.color = '';
    }
  }
}

function setupAppsDropdown() {
  const appGridBtn = document.getElementById('appGridBtn');
  const appsDropdown = document.getElementById('appsDropdown');

  if (appGridBtn && appsDropdown) {
    appGridBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      appsDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!appsDropdown.contains(e.target) && e.target !== appGridBtn) {
        appsDropdown.classList.remove('show');
      }
    });
  }
}

// ==========================================
// 8. Toast Notification Helper
// ==========================================
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// Helper: Escape HTML strings for safety
function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// ==========================================
// 9. Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Clock
  updateClock();
  setInterval(updateClock, 1000);

  // 2. Weather
  setupWeatherTabs();
  renderWeather();

  // 3. Search
  setupSearch();

  // 4. Quotes
  setupQuotes();

  // 5. Theme & Apps Menu
  setupTheme();
  setupAppsDropdown();
});
