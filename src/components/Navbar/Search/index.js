import React, { useEffect, useState, useRef } from "react";
import cx from "classnames";
import { push } from "react-router-redux";
import UISearch from "@santiment-network/ui/Search";
import Suggestions from "./Suggestions";
import { useCursorNavigation } from "./navigation";
import { addRecent } from "./RecentsCategory";
import { store } from "../../../redux";
import styles from "./index.module.scss";

const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA"]);

const Search = ({ className, classes, selectSuggestion }) => {
  const inputRef = useRef();
  const [isOpened, setIsOpened] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { onKeyDown, ...props } = useCursorNavigation(
    isOpened,
    onSuggestionSelect
  );

  useEffect(() => {
    if (!searchTerm) return;

    const timer = setTimeout(() => {
      import("webkit/analytics").then(({ track }) => {
        if (track) {
          track.event("navbar_search", { value: searchTerm });
        }
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    function onKeyPress(e) {
      const { code, target } = e;

      if (
        code === "Slash" &&
        !EDITABLE_TAGS.has(target.tagName) &&
        !target.isContentEditable
      ) {
        e.preventDefault();
        openSuggestions();
        input.focus();
      }
    }

    window.addEventListener("keypress", onKeyPress);
    return () => window.removeEventListener("keypress", onKeyPress);
  }, []);

  function openSuggestions() {
    setIsOpened(true);
  }

  function closeSuggestions() {
    setIsOpened(false);
  }

  function onSuggestionSelect(node, item, category) {
    const href = node.getAttribute("href");

    addRecent(category, item);
    closeSuggestions();

    if (selectSuggestion) {
      selectSuggestion(href);
    } else {
      if (href.startsWith("http")) {
        window.location.href = href;
      } else {
        store.dispatch(push(href));
      }
    }
  }

  return (
    <UISearch
      className={cx(
        styles.search,
        isOpened && styles.search_focused,
        className
      )}
      inputClassName={cx(styles.input, classes.input)}
      iconClassName={classes.icon}
      forwardedRef={inputRef}
      placeholder="Search for assets, trends, etc..."
      autoComplete="off"
      onChange={v => setSearchTerm(v)}
      onClick={openSuggestions}
      onBlur={closeSuggestions}
      onKeyDown={onKeyDown}
    >
      <Suggestions
        {...props}
        searchTerm={searchTerm}
        isOpened={isOpened}
        onSuggestionSelect={onSuggestionSelect}
        className={classes.suggestions}
      />
    </UISearch>
  );
};

Search.defaultProps = {
  classes: {}
};

export default Search;
