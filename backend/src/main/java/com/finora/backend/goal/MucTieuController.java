package com.finora.backend.goal;

import com.finora.backend.data.DuLieuDto.MucTieuDto;
import com.finora.backend.goal.MucTieuDtos.GoalContributionDto;
import com.finora.backend.goal.MucTieuDtos.NapTienRequest;
import com.finora.backend.goal.MucTieuDtos.NapTienResponse;
import com.finora.backend.goal.MucTieuDtos.NguongCanhBaoRequest;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/muc-tieu")
public class MucTieuController {

    private final MucTieuService mucTieuService;

    public MucTieuController(MucTieuService mucTieuService) {
        this.mucTieuService = mucTieuService;
    }

    @PostMapping("/{id}/nap-tien")
    public NapTienResponse napTien(
            @AuthenticationPrincipal String userId,
            @PathVariable("id") String goalId,
            @RequestBody NapTienRequest request
    ) {
        return mucTieuService.napTienVaoMucTieu(userId, goalId, request);
    }

    @GetMapping("/{id}/lich-su")
    public List<GoalContributionDto> layLichSu(
            @AuthenticationPrincipal String userId,
            @PathVariable("id") String goalId
    ) {
        return mucTieuService.layLichSuDongGop(userId, goalId);
    }

    @PutMapping("/{id}/nguong")
    public MucTieuDto capNhatNguong(
            @AuthenticationPrincipal String userId,
            @PathVariable("id") String goalId,
            @RequestBody NguongCanhBaoRequest request
    ) {
        return mucTieuService.capNhatNguongCanhBao(userId, goalId, request.nguong());
    }
}
