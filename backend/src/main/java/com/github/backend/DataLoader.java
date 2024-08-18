package com.github.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.github.backend.repository.BoardRepository;
import com.github.backend.model.Board;

@Component
public class DataLoader implements CommandLineRunner {

    private final BoardRepository boardRepository;

    public DataLoader(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (boardRepository.count() == 0) {
            Board board = new Board();
            board.setNoticeName("Default Board");
            boardRepository.save(board);
        }
    }
}
