import BoardUser from "src/types/board-user.interface";
import ResponseDto from "../response.dto";

// interface: get board user response body dto //
export default interface GetBoardUserResponseDto extends ResponseDto {
    boardList: BoardUser[];
}
