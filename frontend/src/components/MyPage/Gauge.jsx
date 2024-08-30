import React from "react";
import styled from "styled-components";

const StyledBase = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 15px;
  border: 1px solid #000;
  width: 200px;
  background-color: #e0e0e0;
  overflow: hidden;
  border-radius: 10px;
`;

const StyledRange = styled.div`
  width: ${({ width }) => `${width}%`};
  height: 100%;
  position: absolute;
  background: black;
  top: 0;
  left: 0;
  border-radius: 10px;
`;

const StyledText = styled.div`
  color: red;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
`;

// 레벨과 퍼센트 게이지는 백엔드 연결 후 특정 조건에 따라 바뀔 수 있도록 수정 해야함
// 현재 임의로 설정한 퍼센트 게이지가 75%기 때문에 75%로 임의 설정
const Gauge = ({ value }) => {
  return (
    <StyledBase>
      <StyledRange width={value} />
      <StyledText style={{ position: "absolute", left: "10px" }}>
        0 Lv.
      </StyledText>
      <StyledText style={{ position: "absolute", right: "10px" }}>
        75%
      </StyledText>
    </StyledBase>
  );
};

export default Gauge;
