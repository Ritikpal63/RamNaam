import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  RotateCcw,
  Undo2,
  Save,
  PenLine,
  Delete,
  BookOpenCheck,
} from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 108;

const RAM_SEQUENCE = ["r", "a", "m"];
const SHRI_RAM_SEQUENCE = ["s", "h", "r", "i", "r", "a", "m"];

const makeEmptyPage = () =>
  Array.from({ length: PAGE_SIZE }, () => ({
    roman: "",
    hindi: "",
    complete: false,
  }));

const makePageId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `page-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const romanToHindi = (value) => {
  const text = value.toLowerCase().replace(/\s+/g, "");

  const map = {
    "": "",
    r: "र",
    ra: "रा",
    ram: "राम",
    s: "स",
    sh: "श",
    shr: "श्र",
    shri: "श्री",
    shrir: "श्री र",
    shrira: "श्री रा",
    shriram: "श्री राम",
  };

  return map[text] ?? "";
};

const getSequence = (roman) => {
  if (roman.startsWith("s")) {
    return SHRI_RAM_SEQUENCE;
  }

  return RAM_SEQUENCE;
};

const getDisplayName = (cell) => {
  if (!cell) return "";

  if (cell.roman === "ram") {
    return "राम";
  }

  if (cell.roman === "shriram") {
    return "श्री राम";
  }

  return cell.hindi;
};

export default function RamNaamWriter() {
  const [cells, setCells] = useState(makeEmptyPage);
  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [pageId, setPageId] = useState(makePageId);
  const [stats, setStats] = useState({
    todayCount: 0,
    totalCount: 0,
  });

  const inputRefs = useRef([]);
  const { user } = useAuth();

  const completedCount = useMemo(
    () => cells.filter((cell) => cell.complete).length,
    [cells],
  );

  const loadStats = useCallback(async () => {
    if (!user) {
      setStats({
        todayCount: 0,
        totalCount: 0,
      });
      return;
    }

    try {
      const { data } = await api.get("/ramnaam/me");

      setStats({
        todayCount: Number(data.todayCount || 0),
        totalCount: Number(data.totalCount || 0),
      });
    } catch {
      setStats((prev) => prev);
    }
  }, [user]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const focusCell = (index) => {
    requestAnimationFrame(() => {
      inputRefs.current[index]?.focus();
    });
  };

  const completeCell = (index, roman, hindi) => {
    setCells((prev) =>
      prev.map((cell, cellIndex) =>
        cellIndex === index
          ? {
              roman,
              hindi,
              complete: true,
            }
          : cell,
      ),
    );

    setMessage("");

    if (index < PAGE_SIZE - 1) {
      const nextIndex = index + 1;

      setActiveIndex(nextIndex);

      setTimeout(() => {
        focusCell(nextIndex);
      }, 0);
    } else {
      setActiveIndex(PAGE_SIZE);

      setMessage(
        "🙏 108 राम नाम का पृष्ठ पूरा हो गया। अब “साधना में जमा करें” दबाएँ।",
      );
    }
  };

  const handleCharacter = (index, character) => {
    if (index !== activeIndex) {
      return;
    }

    if (activeIndex >= PAGE_SIZE) {
      return;
    }

    const key = character.toLowerCase();

    if (!/^[a-z]$/.test(key)) {
      return;
    }

    const currentCell = cells[index];

    if (currentCell.complete) {
      return;
    }

    let currentRoman = currentCell.roman;

    if (!currentRoman) {
      if (key !== "r" && key !== "s") {
        setMessage(
          "राम लिखने के लिए R दबाएँ या श्री राम लिखने के लिए S दबाएँ।",
        );
        return;
      }
    }

    const sequence = currentRoman.startsWith("s")
      ? SHRI_RAM_SEQUENCE
      : currentRoman.startsWith("r")
        ? RAM_SEQUENCE
        : key === "s"
          ? SHRI_RAM_SEQUENCE
          : RAM_SEQUENCE;

    const expected = sequence[currentRoman.length];

    if (key !== expected) {
      setMessage(`अगला अक्षर "${expected.toUpperCase()}" लिखें।`);
      return;
    }

    const newRoman = `${currentRoman}${key}`;
    const hindi = romanToHindi(newRoman);

    const isRamComplete = newRoman === "ram";

    const isShriRamComplete = newRoman === "shriram";

    if (isRamComplete || isShriRamComplete) {
      completeCell(index, newRoman, hindi);

      return;
    }

    setCells((prev) =>
      prev.map((cell, cellIndex) =>
        cellIndex === index
          ? {
              ...cell,
              roman: newRoman,
              hindi,
            }
          : cell,
      ),
    );

    setMessage("");
  };

  const handleKeyDown = (event, index) => {
    if (index !== activeIndex) {
      event.preventDefault();
      return;
    }

    if (event.ctrlKey || event.metaKey || event.altKey) {
      if (event.key.toLowerCase() === "v") {
        event.preventDefault();

        setMessage("कॉपी-पेस्ट की अनुमति नहीं है। कृपया राम नाम स्वयं लिखें।");
      }

      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();

      const currentCell = cells[index];

      if (!currentCell.roman) {
        if (index > 0) {
          const previousIndex = index - 1;

          setCells((prev) =>
            prev.map((cell, cellIndex) =>
              cellIndex === previousIndex
                ? {
                    ...cell,
                    complete: false,
                  }
                : cell,
            ),
          );

          setActiveIndex(previousIndex);

          setTimeout(() => {
            focusCell(previousIndex);
          }, 0);
        }

        return;
      }

      const newRoman = currentCell.roman.slice(0, -1);

      setCells((prev) =>
        prev.map((cell, cellIndex) =>
          cellIndex === index
            ? {
                roman: newRoman,
                hindi: romanToHindi(newRoman),
                complete: false,
              }
            : cell,
        ),
      );

      setMessage("");
      return;
    }

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      return;
    }

    if (/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();

      handleCharacter(index, event.key);

      return;
    }

    event.preventDefault();
  };

  const handleInput = (event, index) => {
    const inputType = event.nativeEvent?.inputType;

    const data = event.nativeEvent?.data;

    if (inputType === "deleteContentBackward") {
      const fakeEvent = {
        preventDefault: () => {},
        key: "Backspace",
        ctrlKey: false,
        metaKey: false,
        altKey: false,
      };

      handleKeyDown(fakeEvent, index);

      return;
    }

    if (data && /^[a-zA-Z]$/.test(data)) {
      handleCharacter(index, data);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    setMessage(
      "कॉपी-पेस्ट की अनुमति नहीं है। कृपया प्रत्येक राम नाम स्वयं लिखें।",
    );
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setMessage("Drag & Drop की अनुमति नहीं है। कृपया राम नाम स्वयं लिखें।");
  };

  const selectCell = (index) => {
    if (index === activeIndex) {
      focusCell(index);
      return;
    }

    if (index < activeIndex && !cells[index].complete) {
      setActiveIndex(index);
      focusCell(index);
    }
  };

  const undo = () => {
    setMessage("");

    if (activeIndex >= PAGE_SIZE) {
      const lastIndex = PAGE_SIZE - 1;

      const lastCell = cells[lastIndex];

      const newRoman = lastCell.roman.slice(0, -1);

      setCells((prev) =>
        prev.map((cell, index) =>
          index === lastIndex
            ? {
                roman: newRoman,
                hindi: romanToHindi(newRoman),
                complete: false,
              }
            : cell,
        ),
      );

      setActiveIndex(lastIndex);

      setTimeout(() => {
        focusCell(lastIndex);
      }, 0);

      return;
    }

    const currentCell = cells[activeIndex];

    if (currentCell?.roman) {
      const newRoman = currentCell.roman.slice(0, -1);

      setCells((prev) =>
        prev.map((cell, index) =>
          index === activeIndex
            ? {
                roman: newRoman,
                hindi: romanToHindi(newRoman),
                complete: false,
              }
            : cell,
        ),
      );

      focusCell(activeIndex);

      return;
    }

    if (activeIndex > 0) {
      const previousIndex = activeIndex - 1;

      const previousCell = cells[previousIndex];

      const newRoman = previousCell.roman.slice(0, -1);

      setCells((prev) =>
        prev.map((cell, index) =>
          index === previousIndex
            ? {
                roman: newRoman,
                hindi: romanToHindi(newRoman),
                complete: false,
              }
            : cell,
        ),
      );

      setActiveIndex(previousIndex);

      setTimeout(() => {
        focusCell(previousIndex);
      }, 0);
    }
  };

  const clearCurrent = () => {
    if (activeIndex >= PAGE_SIZE) {
      return;
    }

    setCells((prev) =>
      prev.map((cell, index) =>
        index === activeIndex
          ? {
              roman: "",
              hindi: "",
              complete: false,
            }
          : cell,
      ),
    );

    setMessage("");

    focusCell(activeIndex);
  };

  const resetPage = () => {
    setCells(makeEmptyPage());
    setActiveIndex(0);
    setPageId(makePageId());

    setMessage("पृष्ठ साफ कर दिया गया।");

    setTimeout(() => {
      focusCell(0);
    }, 0);
  };

  const savePage = async () => {
    if (!user) {
      setMessage("साधना जमा करने के लिए पहले लॉगिन करें।");

      return;
    }

    if (completedCount < 1) {
      setMessage("पहले कम से कम एक पूरा राम नाम लिखें।");

      return;
    }

    const entries = cells
      .filter((cell) => cell.complete)
      .map((cell) => getDisplayName(cell));

    try {
      setSaving(true);

      const { data } = await api.post("/ramnaam/deposit", {
        entries,
        pageId,
      });

      setMessage(
        `🙏 ${Number(data.count || completedCount).toLocaleString(
          "en-IN",
        )} राम नाम आपकी साधना में जमा हो गए।`,
      );

      setCells(makeEmptyPage());
      setActiveIndex(0);
      setPageId(makePageId());

      setStats({
        todayCount: Number(data.todayCount || 0),
        totalCount: Number(data.totalCount || 0),
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "अभी साधना जमा नहीं हो पाई।");
    } finally {
      setSaving(false);
    }
  };

  const progress = Math.round((completedCount / PAGE_SIZE) * 100);

  return (
    <section id="write" className="section-shell feature-grid three">
      <article className="panel dashboard-preview">
        <div className="panel-title">🙏 मेरी साधना Dashboard</div>

        <div
          className="progress-ring writer-progress-ring"
          style={{
            "--writer-progress": `${progress}%`,
          }}
        >
          <span>{progress}%</span>
        </div>

        <div className="dashboard-meta">
          <p>
            <b>इस पृष्ठ पर</b>
            <br />
            {completedCount.toLocaleString("en-IN")} / 108
          </p>

          <p>
            <b>आज जमा</b>
            <br />
            {stats.todayCount.toLocaleString("en-IN")}
          </p>

          <p>
            <b>कुल जमा</b>
            <br />
            {stats.totalCount.toLocaleString("en-IN")}
          </p>

          <p>
            <b>पृष्ठ में शेष</b>
            <br />
            {Math.max(0, PAGE_SIZE - completedCount)}
          </p>
        </div>

        <a
          className="btn primary full"
          href="#ram-writing-book"
          onClick={() => {
            setTimeout(() => {
              if (activeIndex < PAGE_SIZE) {
                focusCell(activeIndex);
              }
            }, 300);
          }}
        >
          <PenLine size={19} />
          श्री राम लिखना जारी रखें
        </a>
      </article>

      <article
        className="panel writer-panel ram-writer-v2"
        id="ram-writing-book"
      >
        <div className="panel-title green">
          <BookOpenCheck size={21} />
          राम नाम लेखन — 108 नाम का पृष्ठ
        </div>

        <div className="writer-instruction">
          <strong>English keyboard से RAM या SHRI RAM लिखें।</strong>

          <span>
            English में टाइप होगा लेकिन स्क्रीन पर हिन्दी में राम नाम दिखाई
            देगा।
          </span>
        </div>

        <div className="ram-page-summary">
          <span>
            सक्रिय खाना:{" "}
            <strong>
              {activeIndex >= PAGE_SIZE ? PAGE_SIZE : activeIndex + 1}
            </strong>
          </span>

          <span>
            पृष्ठ गणना:{" "}
            <strong>
              {completedCount} / {PAGE_SIZE}
            </strong>
          </span>

          <span>
            लिखें: <strong>RAM → राम</strong>
          </span>

          <span>
            या: <strong>SHRI RAM → श्री राम</strong>
          </span>
        </div>

        <div className="ram-writing-page">
          {cells.map((cell, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={index}
                className={`ram-name-cell ${cell.complete ? "complete" : ""} ${
                  isActive ? "active" : ""
                }`}
                onClick={() => selectCell(index)}
              >
                <small>{index + 1}</small>

                <input
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  value={cell.hindi}
                  readOnly
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  onInput={(event) => handleInput(event, index)}
                  onPaste={handlePaste}
                  onDrop={handleDrop}
                  onContextMenu={(event) => event.preventDefault()}
                  disabled={index > activeIndex || cell.complete}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="text"
                  aria-label={`राम नाम ${index + 1}`}
                  placeholder={isActive ? "राम" : ""}
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    textAlign: "center",
                    fontSize: "1.05rem",
                    fontWeight: "600",
                    color: "inherit",
                    fontFamily: "inherit",
                    padding: "8px 2px",
                    cursor: isActive ? "text" : "default",
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="writer-tools writer-tools-v2">
          <button type="button" onClick={undo}>
            <Undo2 size={18} />
            पिछला अक्षर
          </button>

          <button
            type="button"
            onClick={clearCurrent}
            disabled={activeIndex >= PAGE_SIZE}
          >
            <Delete size={18} />
            खाना साफ करें
          </button>

          <button type="button" onClick={resetPage}>
            <RotateCcw size={18} />
            पूरा पृष्ठ रीसेट
          </button>

          <strong>स्वतः गिनती: {completedCount.toLocaleString("en-IN")}</strong>
        </div>

        <button
          className="btn primary full deposit-btn"
          type="button"
          onClick={savePage}
          disabled={saving || completedCount < 1}
        >
          <Save size={18} />

          {saving
            ? "जमा हो रहा है..."
            : `${completedCount.toLocaleString(
                "en-IN",
              )} राम नाम साधना में जमा करें`}
        </button>

        {message && <p className="form-message">{message}</p>}
      </article>

      <article className="panel inspiration-panel">
        <div className="panel-title">🏆 प्रेरणा सूची</div>

        {[
          ["भक्त अ", "5,25,000"],
          ["भक्त ब", "3,10,000"],
          ["भक्त स", "2,75,000"],
          ["भक्त द", "2,10,000"],
          ["भक्त इ", "1,85,000"],
        ].map((item, index) => (
          <div className="rank-row" key={item[0]}>
            <span className="rank">{index + 1}</span>

            <b>{item[0]}</b>

            <strong>{item[1]}</strong>
          </div>
        ))}

        <p className="soft-note">
          यह प्रतियोगिता नहीं, एक-दूसरे को प्रेरित करने का माध्यम है।
        </p>
      </article>
    </section>
  );
}
