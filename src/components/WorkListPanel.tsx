import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { type Work, works } from '../data/works';

interface WorkListPanelProps {
  onSelect: (work: Work) => void;
}

const WorkListPanel = ({ onSelect }: WorkListPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredWorks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return works;
    return works.filter(
      (work) => work.name.toLowerCase().includes(normalized) || work.title.toLowerCase().includes(normalized)
    );
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (work: Work) => {
    onSelect(work);
    setIsOpen(false);
  };

  return (
    <>
      <ToggleButton type="button" onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? '목록 닫기' : '작품 목록'}
      </ToggleButton>

      <Drawer $open={isOpen}>
        <List>
          {filteredWorks.length === 0 && <Empty>검색 결과가 없습니다</Empty>}
          {filteredWorks.map((work) => (
            <ListItem key={work.id}>
              <button type="button" onClick={() => handleSelect(work)}>
                <ListName className="name">{work.name}</ListName>
                <ListTitle>{work.title.replace(/\n/g, ' ')}</ListTitle>
                <ListKeyword>{work.keyword}</ListKeyword>
              </button>
            </ListItem>
          ))}
        </List>
        <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Seacrh" />
      </Drawer>
    </>
  );
};

const ToggleButton = styled.button`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 900;
  padding: 0.8rem 1.6rem;

  background-color: red;

  color: ${({ theme }) => theme.colors.black};

  &:hover {
    color: ${({ theme }) => theme.colors.grey};
  }
`;

const Drawer = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 40vw;
  z-index: 800;
  display: flex;
  flex-direction: column;
  padding-top: 5rem;
  background-color: ${({ theme }) => theme.colors.white};

  border-left: 0.1rem solid ${({ theme }) => theme.colors.border};
  transform: translateX(${({ $open }) => ($open ? '0' : '100%')});
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 720px) {
    width: 100%;
  }
`;

const List = styled.ul`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
`;

const ListName = styled.div`
  width: 15%;
`;

const ListTitle = styled.div`
  ${({ theme }) => theme.fonts.Text01};

  padding-right: 2rem;
  width: 50%;
`;

const ListKeyword = styled.div`
  ${({ theme }) => theme.fonts.Text01};
  width: 20%;
`;

const ListItem = styled.li`
  border-bottom: 1px solid;
  button {
    display: flex;
    width: 100%;

    text-align: left;

    ${({ theme }) => theme.fonts.Text01};

    &:hover {
      color: ${({ theme }) => theme.colors.grey};
    }
  }

  .name {
    color: ${({ theme }) => theme.colors.grey};
    font-weight: 600;
    margin-right: 0.6rem;
    ${({ theme }) => theme.fonts.Text01};
  }
`;

const Empty = styled.p`
  padding: 1.6rem 1rem;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.black};
`;

const SearchInput = styled.input`
  border: none;
  border-top: 1px solid lightgrey;
  padding: 1rem 1.6rem;
  font-size: 1.4rem;
  ${({ theme }) => theme.colors.black};

  &::placeholder {
    color: ${({ theme }) => theme.colors.lightgrey};
  }
`;

export default WorkListPanel;
