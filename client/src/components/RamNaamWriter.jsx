import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpenCheck, Delete, PenLine, RotateCcw, Save, Undo2 } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const PAGE_SIZE = 108;
const RAM_SEQUENCE = ['r', 'a', 'm'];
const SHRI_RAM_SEQUENCE = ['s', 'h', 'r', 'i', 'r', 'a', 'm'];

const makeCells = () => Array.from({ length: PAGE_SIZE }, () => ({ roman: '', hindi: '', complete: false }));
const makePageId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `page-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const romanToHindi = (value) => {
  const key = value.toLowerCase().replace(/\s+/g, '');
  return {
    '': '',
    r: 'र',
    ra: 'रा',
    ram: 'राम',
    s: 'स',
    sh: 'श',
    shr: 'श्र',
    shri: 'श्री',
    shrir: 'श्री र',
    shrira: 'श्री रा',
    shriram: 'श्री राम'
  }[key] ?? '';
};

const completedText = (cell) => {
  if (!cell) return '';
  if (cell.roman === 'ram') return 'राम';
  if (cell.roman === 'shriram') return 'श्री राम';
  return cell.hindi;
};

export default function RamNaamWriter() {
  const [cells, setCells] = useState(makeCells);
  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [depositing, setDepositing] = useState(false);
  const [pageId, setPageId] = useState(makePageId);
  const [summary, setSummary] = useState({ todayCount: 0, totalCount: 0 });
  const inputRefs = useRef([]);
  const { user } = useAuth();
  const { t, locale, language } = useLanguage();

  const completeCount = useMemo(() => cells.filter((cell) => cell.complete).length, [cells]);

  const loadSummary = useCallback(async () => {
    if (!user) {
      setSummary({ todayCount: 0, totalCount: 0 });
      return;
    }
    try {
      const { data } = await api.get('/ramnaam/me');
      setSummary({
        todayCount: Number(data.todayCount || 0),
        totalCount: Number(data.totalCount || 0)
      });
    } catch {
      setSummary((current) => current);
    }
  }, [user]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const focusCell = (index) => {
    requestAnimationFrame(() => inputRefs.current[index]?.focus());
  };

  const completeCell = (index, roman, hindi) => {
    setCells((current) => current.map((cell, i) => (i === index ? { roman, hindi, complete: true } : cell)));
    setMessage('');
    if (index < PAGE_SIZE - 1) {
      const next = index + 1;
      setActiveIndex(next);
      setTimeout(() => focusCell(next), 0);
    } else {
      setActiveIndex(PAGE_SIZE);
      setMessage(t('writer.completedPage'));
    }
  };

  const processCharacter = (index, rawCharacter) => {
    if (index !== activeIndex || activeIndex >= PAGE_SIZE) return;
    const character = rawCharacter.toLowerCase();
    if (!/^[a-z]$/.test(character)) return;

    const currentCell = cells[index];
    if (currentCell.complete) return;

    const roman = currentCell.roman;
    if (!roman && character !== 'r' && character !== 's') {
      setMessage(t('writer.startHint'));
      return;
    }

    const expected = (roman.startsWith('s')
      ? SHRI_RAM_SEQUENCE
      : roman.startsWith('r')
        ? RAM_SEQUENCE
        : character === 's'
          ? SHRI_RAM_SEQUENCE
          : RAM_SEQUENCE)[roman.length];

    if (character !== expected) {
      setMessage(t('writer.nextLetter', { letter: expected.toUpperCase() }));
      return;
    }

    const nextRoman = `${roman}${character}`;
    const hindi = romanToHindi(nextRoman);

    if (nextRoman === 'ram' || nextRoman === 'shriram') {
      completeCell(index, nextRoman, hindi);
      return;
    }

    setCells((current) => current.map((cell, i) => (i === index ? { ...cell, roman: nextRoman, hindi } : cell)));
    setMessage('');
  };

  const handleKeyDown = (event, index) => {
    if (index !== activeIndex) {
      event.preventDefault();
      return;
    }

    if (event.ctrlKey || event.metaKey || event.altKey) {
      if (event.key.toLowerCase() === 'v') {
        event.preventDefault();
        setMessage(t('writer.copyBlocked'));
      }
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      const currentCell = cells[index];
      if (!currentCell.roman) {
        if (index > 0) {
          const previous = index - 1;
          setCells((current) => current.map((cell, i) => (i === previous ? { ...cell, complete: false } : cell)));
          setActiveIndex(previous);
          setTimeout(() => focusCell(previous), 0);
        }
        return;
      }

      const roman = currentCell.roman.slice(0, -1);
      setCells((current) => current.map((cell, i) =>
        i === index ? { roman, hindi: romanToHindi(roman), complete: false } : cell
      ));
      setMessage('');
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      return;
    }

    if (/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
      processCharacter(index, event.key);
      return;
    }

    // Android/iOS IME keys must not be prevented, otherwise the virtual
    // keyboard can fail to deliver its InputEvent/onChange data.
    if (event.key === 'Unidentified' || event.key === 'Process' || event.key === 'Dead') return;

    event.preventDefault();
  };

  const handleChange = (event, index) => {
    const inputType = event.nativeEvent?.inputType;
    const data = event.nativeEvent?.data;
    const value = typeof event.currentTarget?.value === 'string' ? event.currentTarget.value : '';

    if (inputType === 'deleteContentBackward') {
      handleKeyDown(
        { preventDefault: () => {}, key: 'Backspace', ctrlKey: false, metaKey: false, altKey: false },
        index
      );
      return;
    }

    const character = data && /^[a-zA-Z]$/.test(data)
      ? data
      : (value.match(/[a-zA-Z]$/) || [])[0] || '';

    if (character) processCharacter(index, character);

    if (event.currentTarget) {
      event.currentTarget.value = cells[index] ? cells[index].hindi : '';
    }
  };

  const blockPaste = (event) => {
    event.preventDefault();
    setMessage(t('writer.copyBlockedEach'));
  };

  const blockDrop = (event) => {
    event.preventDefault();
    setMessage(t('writer.dropBlocked'));
  };

  const handleCellClick = (index) => {
    if (index === activeIndex) {
      focusCell(index);
      return;
    }
    if (index < activeIndex && !cells[index].complete) {
      setActiveIndex(index);
      focusCell(index);
    }
  };

  const undoCharacter = () => {
    setMessage('');

    if (activeIndex >= PAGE_SIZE) {
      const index = PAGE_SIZE - 1;
      const roman = cells[index].roman.slice(0, -1);
      setCells((current) => current.map((cell, i) =>
        i === index ? { roman, hindi: romanToHindi(roman), complete: false } : cell
      ));
      setActiveIndex(index);
      setTimeout(() => focusCell(index), 0);
      return;
    }

    const currentCell = cells[activeIndex];
    if (currentCell?.roman) {
      const roman = currentCell.roman.slice(0, -1);
      setCells((current) => current.map((cell, i) =>
        i === activeIndex ? { roman, hindi: romanToHindi(roman), complete: false } : cell
      ));
      focusCell(activeIndex);
      return;
    }

    if (activeIndex > 0) {
      const index = activeIndex - 1;
      const roman = cells[index].roman.slice(0, -1);
      setCells((current) => current.map((cell, i) =>
        i === index ? { roman, hindi: romanToHindi(roman), complete: false } : cell
      ));
      setActiveIndex(index);
      setTimeout(() => focusCell(index), 0);
    }
  };

  const clearCell = () => {
    if (activeIndex >= PAGE_SIZE) return;
    setCells((current) => current.map((cell, i) =>
      i === activeIndex ? { roman: '', hindi: '', complete: false } : cell
    ));
    setMessage('');
    focusCell(activeIndex);
  };

  const resetPage = () => {
    setCells(makeCells());
    setActiveIndex(0);
    setPageId(makePageId());
    setMessage(t('writer.pageCleared'));
    setTimeout(() => focusCell(0), 0);
  };

  const deposit = async () => {
    if (!user) {
      setMessage(t('writer.loginToDeposit'));
      return;
    }
    if (completeCount < 1) {
      setMessage(t('writer.writeAtLeastOne'));
      return;
    }

    const entries = cells.filter((cell) => cell.complete).map(completedText);

    try {
      setDepositing(true);
      const { data } = await api.post('/ramnaam/deposit', { entries, pageId });
      setMessage(t('writer.deposited', { count: Number(data.count || completeCount).toLocaleString(locale) }));
      setCells(makeCells());
      setActiveIndex(0);
      setPageId(makePageId());
      setSummary({
        todayCount: Number(data.todayCount || 0),
        totalCount: Number(data.totalCount || 0)
      });
    } catch (error) {
      setMessage(language === 'hi' ? (error.response?.data?.message || t('writer.depositFailed')) : t('writer.depositFailed'));
    } finally {
      setDepositing(false);
    }
  };

  const progress = Math.round((completeCount / PAGE_SIZE) * 100);

  return (
    <section id="write" className="section-shell feature-grid three">
      <article className="panel dashboard-preview">
        <div className="panel-title">{t('writer.dashboardTitle')}</div>
        <div className="progress-ring writer-progress-ring" style={{ '--writer-progress': `${progress}%` }}>
          <span>{progress}%</span>
        </div>
        <div className="dashboard-meta">
          <p><b>{t('writer.onPage')}</b><br />{completeCount.toLocaleString(locale)} / 108</p>
          <p><b>{t('writer.todayDeposited')}</b><br />{summary.todayCount.toLocaleString(locale)}</p>
          <p><b>{t('writer.totalDeposited')}</b><br />{summary.totalCount.toLocaleString(locale)}</p>
          <p><b>{t('writer.remaining')}</b><br />{Math.max(0, PAGE_SIZE - completeCount).toLocaleString(locale)}</p>
        </div>
        <a
          className="btn primary full"
          href="#ram-writing-book"
          onClick={() => setTimeout(() => activeIndex < PAGE_SIZE && focusCell(activeIndex), 300)}
        >
          <PenLine size={19} /> {t('writer.continue')}
        </a>
      </article>

      <article className="panel writer-panel ram-writer-v2" id="ram-writing-book">
        <div className="panel-title green"><BookOpenCheck size={21} /> {t('writer.pageTitle')}</div>
        <div className="writer-instruction">
          <strong>{t('writer.instructionStrong')}</strong>
          <span>{t('writer.instructionSub')}</span>
        </div>

        <div className="ram-page-summary">
          <span>{t('writer.activeBox')}: <strong>{activeIndex >= PAGE_SIZE ? PAGE_SIZE : activeIndex + 1}</strong></span>
          <span>{t('writer.pageCount')}: <strong>{completeCount} / {PAGE_SIZE}</strong></span>
          <span>{t('writer.write')}: <strong>RAM → राम</strong></span>
          <span>{t('writer.or')}: <strong>SHRI RAM → श्री राम</strong></span>
        </div>

        <div className="ram-writing-page">
          {cells.map((cell, index) => {
            const active = index === activeIndex;
            return (
              <div
                className={`ram-name-cell ${cell.complete ? 'complete' : ''} ${active ? 'active' : ''}`}
                onClick={() => handleCellClick(index)}
                key={index}
              >
                <small>{index + 1}</small>
                <input
                  ref={(element) => { inputRefs.current[index] = element; }}
                  type="text"
                  value={cell.hindi}
                  readOnly={false}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  onChange={(event) => handleChange(event, index)}
                  onPaste={blockPaste}
                  onDrop={blockDrop}
                  onContextMenu={(event) => event.preventDefault()}
                  disabled={index > activeIndex || cell.complete}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  inputMode="text"
                  enterKeyHint="next"
                  aria-label={t('writer.aria', { number: index + 1 })}
                  placeholder={active ? 'राम' : ''}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    textAlign: 'center',
                    fontSize: '1.05rem',
                    fontWeight: '600',
                    color: 'inherit',
                    fontFamily: 'inherit',
                    padding: '8px 2px',
                    cursor: active ? 'text' : 'default'
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="writer-tools writer-tools-v2">
          <button type="button" onClick={undoCharacter}><Undo2 size={18} /> {t('writer.undo')}</button>
          <button type="button" onClick={clearCell} disabled={activeIndex >= PAGE_SIZE}><Delete size={18} /> {t('writer.clearCell')}</button>
          <button type="button" onClick={resetPage}><RotateCcw size={18} /> {t('writer.reset')}</button>
          <strong>{t('writer.autoCount')}: {completeCount.toLocaleString(locale)}</strong>
        </div>

        <button className="btn primary full deposit-btn" type="button" onClick={deposit} disabled={depositing || completeCount < 1}>
          <Save size={18} /> {depositing ? t('writer.depositing') : t('writer.deposit', { count: completeCount.toLocaleString(locale) })}
        </button>
        {message && <p className="form-message">{message}</p>}
      </article>

      <article className="panel inspiration-panel">
        <div className="panel-title">{t('writer.inspiration')}</div>
        {[
          [t('writer.devoteeA'), '5,25,000'],
          [t('writer.devoteeB'), '3,10,000'],
          [t('writer.devoteeC'), '2,75,000'],
          [t('writer.devoteeD'), '2,10,000'],
          [t('writer.devoteeE'), '1,85,000']
        ].map((row, index) => (
          <div className="rank-row" key={row[0]}>
            <span className="rank">{index + 1}</span>
            <b>{row[0]}</b>
            <strong>{row[1]}</strong>
          </div>
        ))}
        <p className="soft-note">{t('writer.notCompetition')}</p>
      </article>
    </section>
  );
}
